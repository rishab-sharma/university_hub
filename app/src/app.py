import sys
import os
sys.path.append(os.path.realpath(os.path.dirname(__file__)))
sys.path.append(os.path.realpath(os.path.dirname(__file__)) + "/nmt")
import argparse
from setup.settings import hparams, out_dir
from nmt import nmt
import tensorflow as tf
from core.tokenizer import tokenize, detokenize
from core.sentence import score_answers, replace_in_answers
import colorama
import flask
from flask import Flask, render_template,request
app = Flask(__name__)

current_stdout = None

def do_start_inference(out_dir, hparams):
    global current_stdout
    current_stdout = sys.stdout
    sys.stdout = open(os.devnull, "w")
    nmt_parser = argparse.ArgumentParser()
    nmt.add_arguments(nmt_parser)
    flags, unparsed = nmt_parser.parse_known_args(['--'+k+'='+str(v) for k,v in hparams.items()])
    flags.out_dir = out_dir
    hparams = nmt.create_hparams(flags)
    if not tf.gfile.Exists(flags.out_dir):
        nmt.utils.print_out("# Model folder (out_dir) doesn't exist")
        sys.exit()
    hparams = nmt.create_or_load_hparams(flags.out_dir, hparams, flags.hparams_path, save_hparams=True)
    if not flags.ckpt:
        flags.ckpt = tf.train.latest_checkpoint(flags.out_dir)
    if not hparams.attention:
        model_creator = nmt.inference.nmt_model.Model
    elif hparams.attention_architecture == "standard":
        model_creator = nmt.inference.attention_model.AttentionModel
    elif hparams.attention_architecture in ["gnmt", "gnmt_v2"]:
        model_creator = nmt.inference.gnmt_model.GNMTModel
    else:
        raise ValueError("Unknown model architecture")
    infer_model = nmt.inference.model_helper.create_infer_model(model_creator, hparams, None)

    return (infer_model, flags, hparams)
def do_inference(infer_data, infer_model, flags, hparams):
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
    global current_stdout
    if not current_stdout:
        current_stdout = sys.stdout
        sys.stdout = open(os.devnull, "w")
    with tf.Session(graph=infer_model.graph, config=nmt.utils.get_config_proto()) as sess:
        loaded_infer_model = nmt.inference.model_helper.load_model(infer_model.model, flags.ckpt, sess, "infer")
        sess.run(
            infer_model.iterator.initializer,
            feed_dict={
                infer_model.src_placeholder: infer_data,
                infer_model.batch_size_placeholder: hparams.infer_batch_size
            })
        num_translations_per_input = max(min(hparams.num_translations_per_input, hparams.beam_width), 1)

        answers = []
        while True:
            try:

                nmt_outputs, _ = loaded_infer_model.decode(sess)

                if hparams.beam_width == 0:
                    nmt_outputs = nmt.inference.nmt_model.np.expand_dims(nmt_outputs, 0)

                batch_size = nmt_outputs.shape[1]

                for sent_id in range(batch_size):

                    # Iterate through responses
                    translations = []
                    for beam_id in range(num_translations_per_input):

                        if hparams.eos: tgt_eos = hparams.eos.encode("utf-8")

                        output = nmt_outputs[beam_id][sent_id, :].tolist()
                        if tgt_eos and tgt_eos in output:
                            output = output[:output.index(tgt_eos)]
                        print(output)
                        if hparams.subword_option == "bpe":  # BPE
                            translation = nmt.utils.format_bpe_text(output)
                        elif hparams.subword_option == "spm":  # SPM
                            translation = nmt.utils.format_spm_text(output)
                        else:
                            translation = nmt.utils.format_text(output)
                        translations.append(translation.decode('utf-8'))

                    answers.append(translations)

            except tf.errors.OutOfRangeError:
                print("end")
                break
        os.environ['TF_CPP_MIN_LOG_LEVEL'] = '0'
        sys.stdout.close()
        sys.stdout = current_stdout
        current_stdout = None

        return answers
def start_inference(question):

    global inference_helper, inference_object
    inference_object = do_start_inference(out_dir, hparams)
    inference_helper = lambda question: do_inference(question, *inference_object)
    return inference_helper(question)
inference_object = None
inference_helper = start_inference
def inference(questions, include_blacklisted = True):
    answers_list = process_questions(questions, include_blacklisted)
    if len(answers_list) == 1:
        return answers_list[0]
    else:
        return answers_list
def inference_internal(questions):
    return process_questions(questions)
def get_best_score(answers_score, include_blacklisted = True):

    try:
        index = answers_score.index(1)
        score = 1
    except:
        index = None

    if index is None and include_blacklisted:
        try:
            index = answers_score.index(0)
            score = 0
        except:
            index = 0
            score = -1

    if index is None:
        index = 0
        score = -1

    return (index, score)
def process_questions(questions, include_blacklisted = True):
    if not isinstance(questions, list):
        questions = [questions]
    prepared_questions = []
    for question in questions:
        question = question.strip()
        prepared_questions.append(tokenize(question) if question else '##emptyquestion##')
    answers_list = inference_helper(prepared_questions)

    prepared_answers_list = []
    for index, answers in enumerate(answers_list):
        answers = detokenize(answers)
        answers = replace_in_answers(answers, 'answers')
        answers_score = score_answers(answers, 'answers')
        best_index, best_score = get_best_score(answers_score, include_blacklisted)

        if prepared_questions[index] == '##emptyquestion##':
            prepared_answers_list.append(None)
        else:
            prepared_answers_list.append({'answers': answers, 'scores': answers_score, 'best_index': best_index, 'best_score': best_score})

    return prepared_answers_list

@app.route('/chat/',methods=['GET','POST'])
def chatbox():
    msg = request.get_json()
    print("Question :")
    print(msg)
    print("<----->")
    msg = msg['message']
    question = msg
    answers =process_questions(question)[0]
    print("Answer :")
    print(answers)
    print("//_______//")
    if answers is None:
        return "Question Can't. be Empty"
    else:
        answers = flask.jsonify(answers)
        return answers

@app.route("/",methods=['GET','POST'])
def hello():
    return render_template("index2.html")
# Flask Server
if __name__ == "__main__":
    print("\n\nStarting The Server , Please be patient with the first Response: Regards Rishab Sharma")
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

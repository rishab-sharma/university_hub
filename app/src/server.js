var express = require('express');
var path = require('path');
var app = express();
var data_url = "http://data.c100.hasura.me";//"https://data.rishabapp.hasura-app.io"
var auth_url = "http://auth.c100.hasura.me";//"https://auth.rishabapp.hasura-app.io"


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
app.get('/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});
app.get(auth_url+'/signup', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'try.html'));
});
app.get('/ann.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'ann.html'));
});
app.get('/diss.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'diss.html'));
});
app.get('/sem.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'sem.html'));
});
app.get('/css/creative.min.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/css', 'creative.min.css'))
});
app.get('/css/creative.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/css', 'creative.css'));
});
app.get('/vendor/bootstrap/css/bootstrap.min.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/bootstrap/css', 'bootstrap.min.css'));
});
app.get('/vendor/bootstrap/css/bootstrap.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/bootstrap/css', 'bootstrap.css'));
});
app.get('/vendor/font-awesome/css/font-awesome.min.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/font-awesome/css', 'font-awesome.min.css'));
});
app.get('/vendor/magnific-popup/magnific-popup.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/magnific-popup', 'magnific-popup.css'));
});
app.get('/vendor/jquery/jquery.min.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/jquery', 'jquery.min.js'));
});
app.get('/vendor/bootstrap/js/bootstrap.min.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/bootstrap/js', 'bootstrap.min.js'));
});
app.get('/vendor/scrollreveal/scrollreveal.min.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/scrollreveal', 'scrollreveal.min.js'));
});
app.get('/vendor/magnific-popup/jquery.magnific-popup.min.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/magnific-popup', 'jquery.magnific-popup.min.js'));
});
app.get('/js/creative.min.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/js', 'creative.min.js'));
});
app.get('/img/uni.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/img', 'uni.jpg'));
});
app.get('/img/header.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/img', 'header.jpg'));
});

app.get('/sign_in.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'sign_in.html'));
});
app.get('/register.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'register.html'));
});

var counter = 0;
app.get('/counter', function (req, res) {
    counter = counter + 1;
  res.send(counter.toString());
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

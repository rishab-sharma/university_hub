function signup() {

var request = new XMLHttpRequest();
request.onreadystatechange = function() {
if(request.readyState === XMLHttpRequest.Done){
if(request.status === 200){
hasura_id = x.hasura_id;
request = new XMLHttpRequest();
request.onreadystatechange = function(){
if(request.readyState === XMLHttpRequest.DONE) {
if(request.status ===200){
alert('Account Created and user_info stored successfully');
}
else{
alert('Something went wrong on second reuest');
console.log(this.responseText);
}
}
};//second request
request.open('POST' , 'http://data.c100.hasura.me/v1/query', true);
request.setRequestHeader('Content-Type','application/json');
request.send(JSON.stringify({ "type":"insert",
				"args":{
					"table":"user_info",
					"objects":[
						{"id":hasura_id,
						"username":uname,
						"email" : email,
						}]
				}}
			));

		}else {
alert('Something went wrong on the server'+this.responseText);
		}
	}
};
var uname = $('#signup_username').val();
var pass  = $('#signup_password').val();
var email = $('#signup_email').val();
if(pass.length<8){
alert('Password must be atleast 8 characters long');}
request.open('POST' , 'http://auth.c100.hasura.me/signup', true);
request.setRequestHeader('Content-Type','application/json');
request.send(JSON.stringify({username: uname, password: pass}));
}

function login(){
	var request = new XMLHttpRequest();
request.onreadystatechange = function() {
if(request.status === 200){
window.location.replace('/ann.html');
}
}
var uname = $('#login_username').val();
var pass  = $('#login_password').val();
request.open('POST' , 'http://auth.c100.hasura.me/login', true);
request.setRequestHeader('Content-Type','application/json');
request.send(JSON.stringify({username: uname, password: pass}));

}

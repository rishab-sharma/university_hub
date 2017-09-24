/*Submit Login username/password*/
var auth_token;
var hasura_id;
var username;
var nameOfUser;
var hasura_id_int;
var uname,name,email,number;
var data_url = "http://data.c100.hasura.me";//"https://data.rishabapp.hasura-app.io"
var auth_url = "http://auth.c100.hasura.me";//"https://auth.rishabapp.hasura-app.io"



function toNumber(str) {
	//console.log("changing to integer:"+str);
	return str*1;
}
//getting and setting cookie
function createCookie(name,value){
	var cookie_string = name + "=" + escape ( value );
//	console.log(cookie_string);
	document.cookie = cookie_string;
	//console.log("setting cookie: "+name+"="+value);
}


function readCookie(cname){
	//console.log("reading cookie of : "+cname);
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

var delete_cookie = function(name) {
	document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	//console.log("cookie deleted: "+name);
};
//Login function
      $('#login_btn').click(function(){
        var username=$('#login_username').val().trim();
        var password=$('#login_password').val();
        if(username.length==0){
          messageAlert('login-message','Username cannot be empty',1);
          return;
        }
        if(password.length==0){
          messageAlert('login-message','Password cannot be empty',1);
          return;
        }
console.log("Its dojne");
        $('#login_btn').addClass('loading');
        $.ajax({
        	method: "POST",
        	url: auth_url+"/login",
        	xhrFields: {
        		withCredentials: true
        	},
        	data: JSON.stringify({
            "username":username,
            "password":password
          }),
        	contentType: "application/json"
        }).done(function (data) {
          //console.log(data);
          window.location.replace('/ann.html');
        }).fail(function (xhr) {
          var res=JSON.parse(xhr.responseText);
          messageAlert('login-message',res.message,1);
          $('#login_btn').removeClass('loading');
        });
      });


//checkNull

//Submit Signup

function signup() {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(request.readyState === XMLHttpRequest.DONE) {
			if(request.status ===200) {
				var x=JSON.parse(this.responseText);
				auth_token = x.auth_token;
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
				request.open('POST' , data_url+'/v1/query', true);
				request.setRequestHeader('Content-Type','application/json');
				request.send(JSON.stringify({ "type":"insert",
				"args":{
					"table":"user_info",
					"objects":[
						{"id":hasura_id,
						"email" : email 
					}]
				}}
			));


		} /*else if(request.status === 403){
			alert('Username/Password is incorrect');
		}*/
		else {
			alert('Something went wrong on the server'+this.responseText);
		}
	}
};
var uname = $('#signup_username').val();
var pass  = $('#signup_password').val();
var email = $('#signup_email').val();

if(pass.length<8)
alert('Password must be atleast 8 characters long');

request.open('POST' , auth_url+'/signup', true);
request.setRequestHeader('Content-Type','application/json');
request.send(JSON.stringify({username: uname, password: pass}));
}


//Logout
function logout() {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(request.readyState === XMLHttpRequest.DONE) {
			if(request.status ===200) {
				alert('Logged out successfully');
				//changing ui of logout button
				var l = document.getElementById('logout_btn');
				l.innerHTML = '<strong>Login<strong>';
				l.id = 'login_text';
				l.setAttribute('data-toggle','modal');
				l.setAttribute('data-target','#loginModal');
				l.removeAttribute('onclick','logout()');
				//welcome_text
				var r = document.getElementById('welcome_text');
				r.innerHTML = 'Join ShareBook..keep sharing your books';
				document.getElementById('reg_btn').style.visibility = 'visible';
				document.getElementById('my-profile').style.visibility = 'hidden';
				delete_cookie('auth_token');
				delete_cookie('hasura_id');
				delete_cookie('login');
				$('#recent_arrival').hide();
				$('#recent-msg').show();
				content='';

			}
			else if(request.status===500){
				alert('Something went wrong on the server');
			}
		}
	};
	request.open('POST',auth_url+"/user/logout ", true);
	request.withCredentials=true;
	request.setRequestHeader('Authorization','Bearer '+readCookie('auth_token'));
	request.send(null);
}

//write function of check login
function checkLogin()
{
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(request.readyState === XMLHttpRequest.DONE) {
			if(request.status ===200) {
				console.log("Logged in");
				var x = JSON.parse(this.responseText);
				//console.log(x.auth_token);
				auth_token = x.auth_token;
				hasura_id = x.hasura_id;
				hasura_id_int=toNumber(hasura_id);
				//console.log(hasura_id_int);
				getName();

				var l = document.getElementById('login_text');
				l.innerHTML = '<strong>Logout<strong>';
				l.id = 'logout_btn';
				l.removeAttribute('data-toggle');
				l.removeAttribute('data-target');
				l.setAttribute('onclick','logout()');
				$('#recent-msg').hide();

				document.getElementById('reg_btn').style.visibility = 'hidden';
				//document.getElementById('profile_btn').style.display = 'block';
				document.getElementById('my-profile').style.visibility = 'visible';
					return true;
			}
			else /*if(request.status ===401) */{
				console.log("Not logged in");

				$('#recent_arrival').hide();
				//$('#recent-msg').innerHTML = "<h4>Login to see recently arrived books</h4>";

				return false;
			}
			/*else{
				alert("Something went wrong on server" + this.responseText);
			}*/

		}
	};
	//auth_token = readCookie('auth_token');
	//console.log(auth_token);
	request.open('GET' , auth_url+'/user/account/info', true);
	request.setRequestHeader('Content-Type','application/json');
	request.setRequestHeader('Authorization','Bearer '+readCookie('auth_token'));
	request.withCredentials=true;
	request.send(null);
}
/*profile-*/

function profile_loading() {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if(request.readyState === XMLHttpRequest.DONE){
			if(request.status === 200){
				var x=JSON.parse(this.responseText);
				auth_token=readCookie('auth_token');
				hasura_id=readCookie('hasura_id');
				hasura_id_int=toNumber(hasura_id);
				document.getElementById("profile_username").innerHTML = x.username;


				//second request
				request = new XMLHttpRequest();
				request.onreadystatechange = function(){
					if(request.readyState === XMLHttpRequest.DONE) {
						if(request.status ===200){
							x=JSON.parse(this.responseText);
							document.getElementById("profile_address").innerHTML = x[0].address;
							document.getElementById("profile_city").innerHTML = x[0].city;
							document.getElementById("profile_college").innerHTML = x[0].college;

							document.getElementById("profile_name").innerHTML = x[0].name;
							document.getElementById("profile_state").innerHTML = x[0].state;
							document.getElementById("profile_email").innerHTML = x[0].email;
							document.getElementById("profile_mobile-no").innerHTML = x[0].mobile;
						}
						else{
							alert('Something went wrong on second reuest');
							console.log(this.responseText);
						}
					}
				};
				request.open('POST' , data_url+'/v1/query', true);
				request.setRequestHeader('Content-Type','application/json');
				request.setRequestHeader('Authorization','Bearer '+readCookie('auth_token'));
				request.send(JSON.stringify({
					"type":"select",
					"args":
					{
						"table" : "user_info",
						"columns" : ["address","city","college","name","state","email","mobile"],
						"where":{'id': hasura_id_int}
					}
				}
			));
		}
		else {
			alert('Something went wrong on the server');
			console.log(this.responseText);
			console.log(auth_token);
		}
	}
};

//console.log("nothing");
auth_token = readCookie('auth_token');
request.open('GET' , auth_url+'/user/account/info', true);
request.setRequestHeader('Content-Type','application/json');
request.setRequestHeader('Authorization','Bearer '+auth_token);
request.withCredentials=true;
request.send(null);
}


// Comment try 1
var comment_btn = $('comment_btn');

comment_btn.onclick = function() {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(request.readyState === XMLHttpRequest.DONE) {
			if(request.status ===200) {
				var x=JSON.parse(this.responseText);
				auth_token = x.auth_token;
				hasura_id = x.hasura_id;
				request = new XMLHttpRequest();
				var name = username;
				var comment = $('comment').val();
                                var comment_text=`<h3>${name}</h3><li>${comment}</li><form><input type="text" id="fname" name="fname" placeholder="Comment"><input type="submit" value="Submit"></form>`;
				document.getElementById('comments').innerHTML = comment_text; 
				} 
			else {
			alert('Something went wrong on the server'+this.responseText);
		}
	}
};
request.open('POST' , data_url+'/v1/query', true);
request.setRequestHeader('Content-Type','application/json');
request.send(JSON.stringify({ "type":"insert",
				"args":{
					"table":"story",
					"objects":[
						{"id":hasura_id,
						"content" : comment 
					        }
						  ],"returning" : ["created"]
				       }
                           }))
                                         };



// Menu button jQuery
$('#menu-button').click(function() {
  $('.ui.sidebar').sidebar('toggle');
});
//
var user_id;
var name;
var user_college;
var user_name;
$.ajax({
  method: "GET",
  url: "https://auth.agrarian72.hasura-app.io/user/account/info",
  xhrFields: {
    withCredentials: true
  }
}).done(function(res){
  user_id=res.hasura_id;
  user_name=res.username;

  $.ajax({
    method:"POST",
    url:"https://data.agrarian72.hasura-app.io/v1/query",
    contentType: "application/json",
    data: JSON.stringify({
      "type":"select",
      "args":{
        "table":"user_info",
        "columns":["*"],
        "where":{
          "id":{
            "$eq":user_id
          }
        }
      }
    }),
    xhrFields: {
      withCredentials: true
    }
  }).done(function(res){
    name=res[0].name;
    user_college=res[0].college_name;
    $('#user').html(name);
    var user_info=`
      <div class="ui modal">
        <i class="close icon"></i>
        <div class="header">
          Profile
        </div>
        <div class="content">
          <div class="ui list">
          <div class="item">
            <div class="header">Username</div>
            ${user_name}
          </div>
          <div class="ui divider"></div>
          <div class="item">
            <div class="header">Name</div>
            ${name}
          </div>
          <div class="ui divider"></div>
          <div class="item">
            <div class="header">College</div>
            ${user_college}
          </div>
          </div>
        </div>
      </div>
    `;
    $('#menu-user-info').prepend(user_info);
  }).fail(function(xhr){
    $('#user').html("Error fetching name");
  });
}).fail(function(xhr){
  $('#user').html("Error");
});

$('#logout').click(function () {
  $.ajax({
    method:"GET",
    url:"https://auth.agrarian72.hasura-app.io/user/logout",
    xhrFields: {
      withCredentials: true
    }
  }).done(function(res){
    window.location.replace('/');
  }).fail(function(xhr){
    var res=JSON.parse(xhr.responseText);
    alert(res.message);
  });
});

$('#menu-user-info').click(function(){
    $('.ui.sidebar').sidebar('toggle');
    setTimeout(function(){
      $('.ui.modal').modal('show');
    },450);
});

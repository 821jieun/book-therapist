//user clicks on signup link
$(".nav-with-login-signup-logout").on("click", ".signup-link", function() {
  $(".login-form").addClass('displayNone');
  $(".signup-form").removeClass('displayNone');
});

//user clicks on login link
$(".nav-with-login-signup-logout").on("click", ".login-link", function() {
  $(".login-form").removeClass('displayNone');
  $(".signup-form").addClass('displayNone');
});

//when logout button is clicked
$(".nav-with-login-signup-logout").on("click", ".logout-button", function() {
  $(".signup-link").removeClass("displayNone");
  $(".login-link").removeClass("displayNone");

  $(".feelings-form").addClass('displayNone');
  $(".recent-recs").addClass('displayNone');
  $(".all-saved-recs").addClass('displayNone');
  $(".logout-button").addClass('displayNone');


  $(".login-form").removeClass('displayNone');

  $(".btn-wrapper").addClass('displayNone');

  localStorage.clear();
});

//user log in form
$("#js-login-form").submit((e) => {
  e.preventDefault();
  const username = $('#login-username').val();
  const password = $('#login-password').val();

  $('#login-username').val('');
  $('#login-password').val('');

  const url = `http://localhost:8080/user/login`;

  $.ajax({
      type: 'POST',
      url: url,
      data: {
        username: username,
        password: password
      },
      dataType: 'json',
      success: function(data) {
        console.log(data)
        const token = data.data.token;
        const userId = data.data.userId;
        const username = data.data.username;
        onSuccessfulLogin(token, userId, username);

      },
      error: function(err) {
        console.error(err);
      }
  });
});

//after user logs in
function onSuccessfulLogin(token, userId, username) {
  $(".signup-link").addClass("displayNone");
  $(".login-link").addClass("displayNone");
  $(".signup-form").addClass('displayNone');
  $(".login-form").addClass('displayNone');

  $(".feelings-form").removeClass('displayNone');
  $(".recent-recs").removeClass('displayNone');

  $(".all-saved-recs").addClass('displayNone');

  $(".logout-button").removeClass('displayNone');
  $(".btn-wrapper").removeClass('displayNone');

  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
  localStorage.setItem("username", username);

}

//user signs up
function handleRegisterUserFormSubmit() {
  $('#js-signup-form').submit((e) => {
    e.preventDefault();
    const username = $('#signup-username').val();
    const password = $('#signup-password').val();
    const firstName = $('#signup-firstName').val();
    const lastName = $('#signup-lastName').val();

    $('#signup-username').val('');
    $('#signup-password').val('');

    $('#signup-firstName').val('');
    $('#signup-lastName').val('');

    const url = `http://localhost:8080/user/register`;

    $.ajax({
        type: 'POST',
        url: url,
        data: {
          username: username,
          password: password,
          firstName: firstName,
          lastName: lastName
        },
        dataType: 'json',
        success: function(data) {
          console.log(data)
        },
        error: function(err) {
          console.error(err);
        }
    });
  });
}

function init() {
  if (localStorage.getItem("token")) {
    onSuccessfulLogin(localStorage.getItem("token"), localStorage.getItem("userId"), localStorage.getItem("username"));
  }
}

$(init())
$(handleRegisterUserFormSubmit())

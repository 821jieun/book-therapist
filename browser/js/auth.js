$(".nav-with-login-signup-logout").on("click", ".signup-link", function() {
  $(".login-form").addClass('displayNone');
  $(".signup-form").removeClass('displayNone');
});
$(".nav-with-login-signup-logout").on("click", ".login-link", function() {
  $(".login-form").removeClass('displayNone');
  $(".signup-form").addClass('displayNone');
});
//
$(".nav-with-login-signup-logout").on("click", ".logout-button", function() {
  $(".signup-link").removeClass("displayNone");
  $(".login-link").removeClass("displayNone");

  $(".feelings-form").addClass('displayNone');
  $(".recent-recs").addClass('displayNone');
  $(".all-saved-recs").addClass('displayNone');
  $(".logout-button").addClass('displayNone');

  // $(".signup-form").removeClass('displayNone');
  $(".login-form").removeClass('displayNone');

  $(".btn-wrapper").addClass('displayNone');
});

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
        onSuccessfulLogin();

      },
      error: function(err) {
        console.error(err);
      }
  });
});

function onSuccessfulLogin() {
  $(".signup-link").addClass("displayNone");
  $(".login-link").addClass("displayNone");
  $(".signup-form").addClass('displayNone');
  $(".login-form").addClass('displayNone');

  $(".feelings-form").removeClass('displayNone');
  $(".recent-recs").removeClass('displayNone');
  $(".all-saved-recs").removeClass('displayNone');
  $(".logout-button").removeClass('displayNone');
  $(".btn-wrapper").removeClass('displayNone');
}

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

$(handleRegisterUserFormSubmit())

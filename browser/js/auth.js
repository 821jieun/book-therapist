$(".nav-with-logout").on("click", "a", function() {

  $(".signup-form").removeClass('displayNone');
  $(".feelings-form").addClass('displayNone');
  $(".recent-recs").addClass('displayNone');
  $(".all-saved-recs").addClass('displayNone');

  $(".logout-button").addClass('displayNone');

  $(".login-form").removeClass('displayNone');
  $(".or").removeClass('displayNone');

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

  $(".signup-form").addClass('displayNone');
  $(".feelings-form").removeClass('displayNone');
  $(".recent-recs").removeClass('displayNone');
  $(".all-saved-recs").removeClass('displayNone');

  $(".logout-button").removeClass('displayNone');

  $(".login-form").addClass('displayNone');
  $(".or").addClass('displayNone');

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

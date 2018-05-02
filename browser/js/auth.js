//cache jQuery variables
const loginForm = $(".login-form");
const signupForm = $(".signup-form");
const signupLink = $(".signup-link");
const loginLink = $(".login-link");
const feelingsForm = $(".feelings-form");
const recentRecs = $(".recent-recs");
const allSavedRecs = $(".all-saved-recs");
const logoutBtn = $(".logout-button");
const btnWrapper = $(".btn-wrapper");
const loginUsername = $('#login-username');
const loginPassword = $('#login-password');
const signupUsername = $('#signup-username');
const signupPassword = $('#signup-password');
const signupFirstname= $('#signup-firstName')
const signupLastname= $('#signup-lastName');
const errorMsg = $(".error-message");

// const url = 'http://localhost:8080'
const url = 'https://cryptic-garden-89464.herokuapp.com'


//user clicks on signup link
$(".nav-with-login-signup-logout").on("click", ".signup-link", function() {
  loginForm.addClass('displayNone');
  signupForm.removeClass('displayNone');

  errorMsg.html('');
});

//user clicks on login link
$(".nav-with-login-signup-logout").on("click", ".login-link", function() {
  loginForm.removeClass('displayNone');
  signupForm.addClass('displayNone');

  errorMsg.html('');
});

//when logout button is clicked
$(".nav-with-login-signup-logout").on("click", ".logout-button", function() {
  //show quote again
  $(".intro").removeClass('displayNone');

  //reveal the options to signup and login
  signupLink.removeClass("displayNone");
  loginLink.removeClass("displayNone");

  //hide feelings entry form and all recent recs and saved recs
  feelingsForm.addClass('displayNone');
  recentRecs.addClass('displayNone');
  allSavedRecs.addClass('displayNone');

  //hide logout button
  logoutBtn.addClass('displayNone');
  //reveal login form
  loginForm.removeClass('displayNone');
  //hide buttons that allow user to view all saved recs and clear recent recs
  btnWrapper.addClass('displayNone');

 const outputElem = $('.error-message');
  outputElem
    .prop('hidden', true)

  localStorage.clear();
});

//user log in form
$("#js-login-form").submit((e) => {
  e.preventDefault();
  const username = loginUsername.val();
  const password = loginPassword.val();

  loginUsername.val('');
  loginPassword.val('');

  $.ajax({
      type: 'POST',
      url: `${url}/user/login`,
      data: {
        username: username,
        password: password
      },
      dataType: 'json',
      success: function(data) {

        const token = data.data.token;
        const userId = data.data.userId;
        const username = data.data.username;

        const outputElem = $('.error-message');
         outputElem
           .prop('hidden', true)

        onSuccessfulLogin(token, userId, username);

      },
      error: function(err) {
        const errorMessage = 'uh oh! something went awry...please try again';
        const outputElem = $('.error-message');
        outputElem
          .prop('hidden', false)
          .html(`<p>${errorMessage}</p>`);
        console.error(err);
      }
  });
});

//after user logs in
function onSuccessfulLogin(token, userId, username) {
  //disappear quote
  $(".intro").addClass("displayNone");

  //disappear the links that were for signing up and logging in
  signupLink.addClass("displayNone");
  loginLink.addClass("displayNone");
  signupForm.addClass('displayNone');
  loginForm.addClass('displayNone');

  //reveal the form for inputting feeling
  feelingsForm.removeClass('displayNone');

  //reveal the logout button, since user is now logged in
  logoutBtn.removeClass('displayNone');
  //reveal the 'show all saved recs' button and 'clear results'
  btnWrapper.removeClass('displayNone');

  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
  localStorage.setItem("username", username);

}

//handling what happens when user signs up
function handleRegisterUserFormSubmit() {
  $('#js-signup-form').submit((e) => {
    e.preventDefault();
    const username = signupUsername.val();
    const password = signupPassword.val();
    const firstName = signupFirstname.val();
    const lastName = signupLastname.val();

    signupUsername.val('');
    signupPassword.val('');

    signupFirstname.val('');
    signupLastname.val('');

    $.ajax({
        type: 'POST',
        url: `${url}/user/register`,
        data: {
          username: username,
          password: password,
          firstName: firstName,
          lastName: lastName
        },
        dataType: 'json',
        success: function(data) {
          signupForm.addClass('displayNone')
          loginForm.removeClass('displayNone')
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

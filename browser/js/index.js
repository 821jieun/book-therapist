
// var showAll = false;
//Loading message
// TODO:figure out why this isn't working correctly
// $(document).ajaxStart(function() {
//   $('#loading').show();
// });
//
// $(document).ajaxStop(function() {
//   $('#loading').hide();
// });

//
$(".clear-results-btn").click(function() {
  $(".recent-recs").addClass("displayNone");
});

let showAll = false;
//get all saved recommendations
$(".show-and-hide-btn").click(() => {

  showAll = !showAll;

  if (showAll) {
    $('.recent-recs').addClass('displayNone');
    $('.all-saved-recs').removeClass('displayNone');
    $(".show-and-hide-btn").text('hide saved');

    $('html, body').animate({
        scrollTop: $(".all-saved-recs").offset().top
    }, 1000);

  } else {
    $(".show-and-hide-btn").text('show saved');
    $('.all-saved-recs').addClass('displayNone');

    $('html, body').animate({
        scrollTop: $("header").offset().top
    }, 1500);
  }

  const url = `http://localhost:8080/recommendations/all/${localStorage.getItem("token")}`;
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        console.log(data, 'this is the data retrieved from storage in mongo db');
        
        displayAllEntries(data)
      },
      error: function(err) {
        console.error(err);
      }
    });
});

function displayAllEntries(data) {
  const recArray = data.recommendations;

  $('.js-all-entries').html('');

  recArray.forEach((rec) => {
    let description = rec.description;
    description = checkStrLength(description);

    let date = rec.publishDate;
    date = makeDateReadable(date);

    const {id, entryText, title, author, image} = rec;

    const body = encodeURIComponent(`
    Title: ${title}

    Author: ${author}

    Description: ${description}

    `);

    const subject = encodeURIComponent('i thought this book might be of interest to you!');
    const href = `mailto:email@email.com?subject=${subject}&body=${body}`

    $('.js-all-entries').prepend(
      `
      <div class="saved-book-rec">
        <div class="book-component"><p class="feelings-entry">Feelings Entry: ${entryText}</p></div>
        <div class="book-component"><p class="date">Date: ${date}</p></div>
        <div class="book-component"><p class="title">Title: ${title}</p></div>
        <div class="book-component"><p class="author">Author: ${author}</p></div>
        <div class="book-component"><p class="description">Description: ${description}</p></div>
        <div class="thumbnail-image book-component">
          <img src="${image}" alt="image of ${title}">
        </div>
        <br />
        <div class=button-and-links>
          <div class="book-component interactive"><button data-id=${id} class="delete-button">delete</button></div>
          <div class="book-component interactive"><a href=${href} data-id=${rec.id} class="email-link">share</a></div>
          <div class="book-component interactive"><a href="https://www.abebooks.com?hp-search-title&tn=${title}" target="_blank" data-id=${rec.id} class="get-book-link">get</a></div>
        </div>
      </div>
      `
      // TODO: how to prepopulate search field with title name in .get-book-link in line 92?

    )
  })
}

//delete recommendation from saved recommendations
$(".js-all-entries").on("click", ".delete-button", deleteRecommendation);

function deleteRecommendation() {
  const id = $(this).data('id');
  $(this).closest(".saved-book-rec").remove();
  const url = `http://localhost:8080/recommendations/delete/${id}/${localStorage.getItem("token")}`;

    $.ajax({
      url: url,
      type: 'DELETE',
      success: function(data) {
        console.log('successfully deleted!');
      },
      error: function(err) {
        console.error(err);
      }
    })
}

//listen for click on save button
$(".js-rec-results").on('click', '.save-book-button', saveBookAndUpdateDb);

//update entryText with saved book information
function saveBookAndUpdateDb() {
  console.log('inside saveBookAndUpdateDb')

  const title = $(this).data('title');
  const publishDate = $(this).data('publishDate');
  const author = $(this).data('author');
  const description = $(this).data('description');
  const image = $(this).data('image');
  const id = $(this).data('id');
  const bookId = $(this).data('bookId');
  // TODO: allow users to save multiple books per entry (possible solution? change db schema to arrays)

  // TODO: find out if is this a11y-friendly?
  $(this)
    .text('saved!');

  //make get call to update db entry for savedbook
  const url = `http://localhost:8080/recommendations/update/${id}/${localStorage.getItem("token")}`;

  console.log(url, 'update/ put url here')
    $.ajax({
      url: url,
      type: 'PUT',
      data: {
        "id": id,
        "bookId": bookId,
        "publishDate": publishDate,
        "title": title,
        "author": author,
        "description": description,
        "image": image
      },
      success: function(data) {
        console.log('fullySUCCESSfully updated!')
      },
      error: function(err) {
        console.error(err);
      }
    })
}

function handleEntrySubmitForm() {
  $('#js-sentiment-entry-form').submit((e) => {
  e.preventDefault();

  const entryText = $('#sentiment-input').val();

  $('#sentiment-input').val('');

  $(".all-saved-recs").addClass('displayNone');
  $(".recent-recs").removeClass('displayNone');

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  const url = `http://localhost:8080/recommendations/create/${token}`;

    $.ajax({
      type: 'POST',
      url: url,
      data: {
        "entryText": entryText
      },
      dataType: 'json',
      success: function(data) {
        console.log(data, 'data in front end create function ')
        $('html, body').animate({
          // TODO: figure out why this isn't working!
            scrollTop: $(".recent-recs").offset().top
        }, 1000);
        extractEntities(data);
      },
      error: function(err) {
        console.error(err);
      }
    })
  });
}

$(handleEntrySubmitForm());

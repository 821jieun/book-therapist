
// const url = 'http://localhost:8080'
const url = 'https://book-therapist.herokuapp.com'


$(document).ready(function() {

    M.updateTextFields();
  });

//Loading message
$(document).ajaxStart(function() {
  $('#loading').show();
});

$(document).ajaxStop(function() {
  $('#loading').hide();
});

$('.clear-results-btn').click(function() {
  $('.recent-recs').addClass('displayNone');
});

$('.btn-wrapper').on('click', '.show-and-hide-btn', showAllSessions);

function showAllSessions() {
    const id = $(this).data('id');

    let buttonText = $('.show-and-hide-btn').text();

    const screenWidth = document.documentElement.clientWidth;
    const screenHeight = document.documentElement.clientHeight;

     if (buttonText === "show sessions") {

      $('.recent-recs').addClass('displayNone');
      $('.all-saved-recs').removeClass('displayNone');
      $('.show-and-hide-btn').text("hide sessions");

    }  else {

      $('.all-saved-recs').addClass('displayNone');
      $('.show-and-hide-btn').text("show sessions");

      $('html, body').animate({
          scrollTop: $('header').offset().top
      }, 1500);
    }

    $.ajax({
      url: `${url}/recommendations/all/${localStorage.getItem('token')}`,
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        displayAllEntries(data)
      },
      error: function(err) {
        console.error(err);
      }
    });

}

// see all books belonging to a particular feelings entry
$('.js-all-entries').on('click', '.see-and-hide-all-books', toggleBookVisibility);

function toggleBookVisibility () {
  const id = $(this).data('id');

  $(`.saved-book-rec[data-id = ${id}]`).find('.book').removeClass('displayNone');

  let buttonText = $(`.see-and-hide-all-books[data-id =${id}]`).text();

  if (buttonText === "see books") {
    $('html, body').animate({
        scrollTop: $(`.saved-book-rec[data-id = ${id}]`).offset().top
    }, 1000);
    $(`.saved-book-rec[data-id = ${id}]`).find('.book').removeClass('displayNone');
    $(`.see-and-hide-all-books[data-id =${id}]`).text('hide books');
  } else {
    $(`.saved-book-rec[data-id = ${id}]`).find('.book').addClass('displayNone');
    $(`.see-and-hide-all-books[data-id =${id}]`).text('see books');
  }
}

function displayAllEntries(data) {
  let recArray = data.recommendations;

  if (!(recArray.length)) {
    //display message to user that s/he has no saved entries
    $('.js-all-entries')
    .html("<p class='no-saved-entries'>you have no saved sessions yet</p>")

  } else {
    $('.js-all-entries').html('');
  }

  $('html, body').animate({
      scrollTop: $('.js-all-entries').offset().top
  }, 1000);


  recArray.forEach((rec) => {
    let date = rec.publishDate;
    date = makeDateReadable(date);

    //get entryText, id
    const { entryText, id} = rec;
    $('.js-all-entries').prepend(`

          <div class="saved-book-rec" data-id=${rec.id}>
            <div class="book-component"><p class="feelings-entry">Feelings Entry: ${entryText}</p></div>
            <div class="book-component"><p class="date">Date: ${date}</p></div>
            <div class="book-component interactive"><button data-id=${id} class="see-and-hide-all-books">see books</button></div>
            <div class="book-component interactive"><button data-id=${id} class="delete-button">delete entire entry</button></div>
          </div>
        </div>
        <div class="all-books" data-id=${rec.id}>

      `)

      //another loop to iterate through the books array in each entry to
      //extract the title, author, description, image for each book
      rec.books.forEach((book) => {

        let description = book.description;
        description = checkStrLength(description);

        const {title, author, image, bookId} = book;
        const body = encodeURIComponent(`
        Title: ${title}

        Author: ${author}

        Description: ${description}

        `);

        const subject = encodeURIComponent('i thought this book might be of interest to you!');
        const href = `mailto:email@email.com?subject=${subject}&body=${body}`

        $(`div[data-id = ${id}]`).append(`
          <div class="book displayNone">
            <div class="book-component title"><p class="title">Title: ${title}</p></div>
            <div class="book-component author"><p class="author">Author: ${author}</p></div>
            <div class="book-component"><p class="description">Description: ${description}</p></div>
            <div class="thumbnail-image book-component">
              <img src="${image}" alt="image of ${title}">
            </div>
            <br />
            <div class=button-and-links>
              <div class="book-component interactive"><button data-bookid=${bookId} data-id=${id} class="delete-single-book-button">delete book</button></div>
              <div class="book-component interactive"><a href=${href} data-id=${rec.id} class="email-link">share</a></div>
              <div class="book-component interactive"><a href="https://www.abebooks.com?hp-search-title&tn=${title}" target="_blank" data-id=${rec.id} class="get-book-link">get</a></div>
            </div>
          </div>
          `)
      });
  });
}
//
$('.js-all-entries').on('click', '.delete-single-book-button', deleteSingleBook);

function deleteSingleBook() {

  const bookId = $(this).data('bookid');
  const recommendationId = $(this).data('id');

      $.ajax({
        context: this,
        url: `${url}/recommendations/delete/singlebook/${recommendationId}/${bookId}/${localStorage.getItem("token")}`,
        type: 'DELETE',
        success: function(data) {
          console.log('successfully deleted!');
          $(this).closest('.book').remove();
        },
        error: function(err) {
          console.error(err);
        }
      });
}

//delete recommendation from saved recommendations
$('.js-all-entries').on('click', '.delete-button', deleteRecommendation);

function deleteRecommendation() {
  const id = $(this).data('id');

    $.ajax({
      url: `${url}/recommendations/delete/${id}/${localStorage.getItem("token")}`,
      type: 'DELETE',
      success: function(data) {
        $(`.saved-book-rec[data-id = ${id}]`).remove();
        console.log('successfully deleted!');
      },
      error: function(err) {
        console.error(err);
      }
    });
}

//listen for click on save button
$(".js-rec-results").on('click', '.save-book-button', saveBookAndUpdateDb);

//update entryText with saved book information
function saveBookAndUpdateDb() {

  const title = $(this).data('title');
  const publishDate = $(this).data('publishDate');
  const author = $(this).data('author');
  const description = $(this).data('description');
  const image = $(this).data('image');
  const id = $(this).data('id');
  const bookId = $(this).data('bookid');

  //to make saved book immediately available for user experience
  localStorage.setItem('title', title)
  localStorage.setItem('publishDate', publishDate)
  localStorage.setItem('author', author)
  localStorage.setItem('description', description)
  localStorage.setItem('image', image)
  localStorage.setItem('id', id)
  localStorage.setItem('bookId', bookId)

  const body = encodeURIComponent(`
  Title: ${title}

  Author: ${author}

  Description: ${description}

  `);

  const subject = encodeURIComponent('i thought this book might be of interest to you!');
  const href = `mailto:email@email.com?subject=${subject}&body=${body}`

   $(`.saved-book-rec[data-id =${id}]`).append(
     `<div class="book displayNone">
    <div class="book-component title"><p class="title">Title: ${title}</p></div>
    <div class="book-component author"><p class="author">Author: ${author}</p></div>
    <div class="book-component"><p class="description">Description: ${description}</p></div>
    <div class="thumbnail-image book-component">
      <img src="${image}" alt="image of ${title}">
    </div>
    <br />
    <div class=button-and-links>
      <div class="book-component interactive"><button data-bookid=${bookId} data-id=${id} class="delete-single-book-button">delete book</button></div>
      <div class="book-component interactive"><a href=${href} data-id=${id} class="email-link">share</a></div>
      <div class="book-component interactive"><a href="https://www.abebooks.com?hp-search-title&tn=${title}" target="_blank" data-id=${id} class="get-book-link">get</a></div>
    </div>
  </div>`
   )
  //make get call to update db entry for savedbook
    $.ajax({
      context: this,
      url: `${url}/recommendations/update/${id}/${localStorage.getItem("token")}`,
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
        $(this)
          .text('saved!');

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

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

    $.ajax({
      type: 'POST',
      url: `${url}/recommendations/create/${token}`,
      data: {
        "entryText": entryText
      },
      dataType: 'json',
      beforeSend: function(){
        $(".loading-rec").show();
      },
      complete: function(){
        $(".loading-rec").hide();
      },
      success: function(data) {

        $('html, body').animate({
            scrollTop: $(".recent-recs").offset().top

        }, 1000);
        $('#sentiment-input').val('');
          googleBookSearchForTitles(data.entryText.split(" "), data.entryText, data.id)

      },
      error: function(err) {
        console.error(err);
      }
    });
  });
}

$(handleEntrySubmitForm());

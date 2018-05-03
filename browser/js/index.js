
const url = 'http://localhost:8080'
// const url = 'https://book-therapist.herokuapp.com'

$('.clear-results-btn').click(function() {
  $('.recent-recs').addClass('displayNone');
});

let showAll = false;
//get all saved recommendations
$(".show-and-hide-btn").click(() => {
  // $('.all-books')
  //   .prop('hidden', true);

  showAll = !showAll;

  if (showAll) {
    $('.recent-recs').addClass('displayNone');
    $('.all-saved-recs').removeClass('displayNone');
    $('.show-and-hide-btn').text('hide saved');

    $('html, body').animate({
        scrollTop: $('.all-saved-recs').offset().top
    }, 1000);

  } else {
    $('.show-and-hide-btn').text('show saved');
    $('.all-saved-recs').addClass('displayNone');

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
});

// see all books belonging to a particular feelings entry
$('.js-all-entries').on('click', '.see-and-hide-all-books', toggleBookVisibility);
//
function toggleBookVisibility () {
  const id = $(this).data('id');

  let buttonText = $(`.see-and-hide-all-books[data-id =${id}]`).text();

  if (buttonText == "see all books") {
    $(`.saved-book-rec[data-id = ${id}]`).find('.book').removeClass('displayNone');
    $(`.see-and-hide-all-books[data-id =${id}]`).text('hide all books');
  } else {
    $(`.saved-book-rec[data-id = ${id}]`).find('.book').addClass('displayNone');
    $(`.see-and-hide-all-books[data-id =${id}]`).text('see all books');
  }
}

function displayAllEntries(data) {
  let recArray = data.recommendations;

  $('.js-all-entries').html('');

  recArray.forEach((rec) => {
    let date = rec.publishDate;
    date = makeDateReadable(date);
    //get entryText, id
    const { entryText, id } = rec;
    $('.js-all-entries').prepend(`
        <div class="saved-book-rec" data-id=${rec.id}>
          <div class="book-component"><p class="feelings-entry">Feelings Entry: ${entryText}</p></div>
          <div class="book-component"><p class="date">Date: ${date}</p></div>
          <div class="book-component interactive"><button data-id=${id} class="see-and-hide-all-books">see all books</button></div>
          <div class="book-component interactive"><button data-id=${id} class="delete-button">delete entire entry</button></div>
        </div>
        <div class="all-books" data-id=${rec.id}>
        </div>
      `)

      //another loop to iterate through the books array in each entry to
      //extract the title, author, description, image for each book
      rec.books.forEach((book) => {

        let description = book.description;
        description = checkStrLength(description);

        const {title, author, image} = book;

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
              <div class="book-component interactive"><button data-id=${rec.id} class="delete-single-book-button">delete book</button></div>
              <div class="book-component interactive"><a href=${href} data-id=${rec.id} class="email-link">share</a></div>
              <div class="book-component interactive"><a href="https://www.abebooks.com?hp-search-title&tn=${title}" target="_blank" data-id=${rec.id} class="get-book-link">get</a></div>
            </div>
          </div>
          `)
      });
  });
}

//delete recommendation from saved recommendations
$('.js-all-entries').on('click', '.delete-button', deleteRecommendation);

function deleteRecommendation() {
  const id = $(this).data('id');
  // $(this).closest('.book').remove();
  // $(this).closest('.saved-book-rec').remove();
  $(`.saved-book-rec[data-id = ${id}]`).remove();

    $.ajax({
      url: `${url}/recommendations/delete/${id}/${localStorage.getItem("token")}`,
      type: 'DELETE',
      success: function(data) {
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
  const bookId = $(this).data('bookId');

  $(this)
    .text('saved!');

  //make get call to update db entry for savedbook
    $.ajax({
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

  $('.all-saved-recs').addClass('displayNone');
  // $('.show-and-hide-btn').text('show saved');
  $('.recent-recs').removeClass('displayNone');

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
        console.log(data, 'data in front end create function ')
        $('html, body').animate({
            scrollTop: $(".recent-recs").offset().top
        }, 1000);
        $('#sentiment-input').val('');
          googleBookSearchForTitles(data.entryText.split(" "), data.entryText, data.id)

      },
      error: function(err) {
        console.error(err);
      }
    })

  });
}

$(handleEntrySubmitForm());

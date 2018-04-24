
var showAll = false;
//Loading message
// $(document).ajaxStart(function() {
//   $('#loading').show();
// });
//
// $(document).ajaxStop(function() {
//   $('#loading').hide();
// });

//?
// $("#js-sentiment-entry-form").submit(function() {
//   $('html, body').animate({
//       scrollTop: $(".recent-recs").offset().top
//   }, 1000);
// });

$(".entry-button").click(function() {
  console.log('clicked on entry button!')
  console.log(`this is recent recs dot offset dot top: ${$(".recent-recs").offset().top}`)
  // TODO: figure out why this doesn't work
  $('html, body').animate({
      scrollTop: $(".recent-recs").offset().top
  }, 1000);
});

//get all saved recommendations
$(".show-and-hide-btn").click(() => {
  showAll = !showAll;
  if (showAll) {
    $('.recent-recs').addClass('displayNone');
    $('.all-saved-recs').removeClass('displayNone');
    $(".show-and-hide-btn").text('hide all saved entries');

    $('html, body').animate({
        scrollTop: $(".all-saved-recs").offset().top
    }, 1000);

  } else {
    $(".show-and-hide-btn").text('show all saved entries');
    $('.all-saved-recs').addClass('displayNone');

    $('html, body').animate({
        scrollTop: $("header").offset().top
    }, 1500);
  }

  const url = `http://localhost:8080/recommendations/all`;
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        console.log(data, '=>this is the data stored in mongo db');
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

    $('.js-all-entries').prepend(
      `
      <div class="saved-book-rec">
        <p class="feelings-entry">Feelings Entry: ${rec.entryText}</p>
        <p class="date">Date: ${date}</p>
        <p class="title">Title: ${rec.title}</p>
        <p class="author">Author: ${rec.author}</p>
        <p class="description">Description: ${description}</p>
        <div class="thumbnail-image">
          <img src="${rec.image}" alt="image of ${rec.title}">
        </div>
        <br />
        <button data-id=${rec.id} class="delete-button">delete</button>
      </div>
      `
    )
  })
}

//delete recommendation from saved recommendations
$(".js-all-entries").on("click", ".delete-button", deleteRecommendation);

function deleteRecommendation() {
  const id = $(this).data('id');

  $(this).parent().remove();

  const url = `http://localhost:8080/recommendations/delete/${id}`;

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

  //make get call to update db entry for savedbook
  const url = `http://localhost:8080/recommendations/update/${id}`;
  console.log(url, 'update/ put url here')
    $.ajax({
      url: url,
      type: 'PUT',
      data: {
        "id": id,
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

//google books api call
function googleBookSearchForTitles(keyWords, entryText, id) {
  const apiKey = 'AIzaSyD1sCrYVwhHVJT17fJf5mRFohJNIfIEV9I';
  let searchTerms = keyWords.join("+");
  const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerms}&key=${apiKey}&country=US`
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        console.log(data, '=>this is the data returned by googlebooks API');
        const recommendations = [];
        console.log(recommendations, 'recommendations in google results')
        data.items.forEach((result, index) => {
          const bookData = {
            title: result.volumeInfo.title || 'n/a',
            author: result.volumeInfo.authors || 'n/a',
            bookId: result.id || 'n/a',
            description: result.volumeInfo.description || 'n/a'
          };
          if (result.volumeInfo.imageLinks) {
            bookData.image = result.volumeInfo.imageLinks.thumbnail || 'n/a'
          }
          recommendations.push(bookData);
        });
        displayBookRecommendations(recommendations, id)
      },
      error: function(err) {
        console.log(err);
      }
    });
}

function displayBookRecommendations(recommendations, id) {
  const results = $('.js-rec-results');

  results.empty();

  recommendations.forEach((recommendation, index) => {
    $('.js-rec-results').append(
      `
      <div class="book-rec">
      <p class="rec-title">Title: ${recommendation.title}</p>
      <p class="rec-author">Author: ${recommendation.author}</p>
      <p class="rec-description">Description: ${checkStrLength(recommendation.description)}</p>
      <div class="rec-thumbnail-image">
      <img src="${recommendation.image}" alt="thumbnail of ${recommendation.title}">
      </div>
      <br />
      <button class="save-book-button" data-id="${id}" data-title="${recommendation.title}" data-author="${recommendation.author}" data-description="${recommendation.description}" data-image="${recommendation.image}">save</button>
      </div>
      `
    )
  })
}

//post
function extractEntities(data) {
    const entryText = data.entryText;
    const id = data.id;
    const baseUrl = `https://api.dandelion.eu/datatxt/nex/v1/?text`;
    const text = encodeURIComponent(entryText);
    const token = '2e0335e9f4b440f7aa8283398c390d69';

    $.ajax({
    url: `${baseUrl}=${text}&token=${token}`,
    dataType: 'json',
    type: 'GET',
    success: function(data) {
      let keyWords = [];
      data.annotations.forEach((word) => {
        keyWords.push(word.spot);
      })
      console.log(keyWords, 'keyWords here')
      if (keyWords.length < 1) {
        keyWords = entryText.split(' ');
      }
      googleBookSearchForTitles(keyWords, entryText, id);
    },
    error: function(err) {
      console.log(err);
       }
  });
}

function handleEntrySubmitForm() {
  $('#js-sentiment-entry-form').submit((e) => {
  e.preventDefault();

  const entryText = $('#sentiment-input').val();

  $('#sentiment-input').val('');

  $(".all-saved-recs").addClass('displayNone');
  $(".recent-recs").removeClass('displayNone');

  const url = `http://localhost:8080/recommendations/create`;

    $.ajax({
      type: 'POST',
      url: url,
      data: {
        "entryText": entryText
      },
      dataType: 'json',
      success: function(data) {
        extractEntities(data);
      },
      error: function(err) {
        console.error(err);
      }
    })
  });
}

$(handleEntrySubmitForm());

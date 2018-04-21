//Loading message
// $(document).ajaxStart(function() {
//   $('#loading').show();
// });
//
// $(document).ajaxStop(function() {
//   $('#loading').hide();
// });

//animate to results
$(".entry-button").click(function() {
  $('html, body').animate({
      scrollTop: $(".recent-recs").offset().top
  }, 1000);
});

$(".get-all-entries-button").click(function() {
  $('html, body').animate({
      scrollTop: $(".all-saved-recs").offset().top
  }, 1000);
});

$('html, body').animate({
    scrollTop: $("header").offset().top
}, 1000);

//get all saved recommendations
$('.get-all-entries-button').click(() => {
  $('.recent-recs').addClass('displayNone');
  $('.all-saved-recs').removeClass('displayNone');
  $('.get-all-entries-button').addClass('displayNone');
  $('.hide-all-entries-button').removeClass('displayNone');

  const url = `http://localhost:8080/recommendations/all`;
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        console.log(data, 'data in onGetAllRecsClick');
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

    $('.js-all-entries').prepend(
      `
      <div class="saved-book-rec">
        <p class="feelings-entry">Feelings Entry: ${rec.entryText}</p>
        <p class="date">Date: ${rec.publishDate}</p>
        <p class="title">Title: ${rec.title}</p>
        <p class="author">Author: ${rec.author}</p>
        <p class="description">Description: ${description}</p>
        <div class="thumbnail-image">
          <img src="${rec.image}" alt="image of ${rec.title}">
        </div>
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
  console.log(id)
  console.log('inside deleteRecs')

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
        console.log('SUCCESSfully updated!')
      },
      error: function(err) {
        console.error(err);
      }
    })
}

$(".js-rec-results").on('click', '.save-book-button', saveBookAndUpdateDb);
$(".show-and-hide-buttons").on('click', '.hide-all-entries-button', hideAllBooks);

function hideAllBooks() {
  $(".get-all-entries-button").removeClass('displayNone');
  $(".all-saved-recs").addClass('displayNone');
  $('.hide-all-entries-button').addClass('displayNone');
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
        console.log(data, 'data in google results');
        const recommendations = [];
        console.log(recommendations, 'recommendations in google results')
        data.items.forEach((result, index) => {
          const bookData = {
            title: result.volumeInfo.title || 'n/a',
            author: result.volumeInfo.authors || 'n/a',
            bookId: result.id || 'n/a',
            description: result.volumeInfo.description || 'n/a',
            image: result.volumeInfo.imageLinks.thumbnail || 'n/a'
          };
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
    // const token = API_KEY;
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
  event.preventDefault();

  const entryText = $('#sentiment-input').val();

  $('#sentiment-input').val('');

  $(".all-saved-recs").addClass('displayNone');
  $(".recent-recs").removeClass('displayNone');

  $(".hide-all-entries-button").addClass('displayNone');
  $(".get-all-entries-button").removeClass('displayNone');

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

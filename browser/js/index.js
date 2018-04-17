
//get all saved recommendations
$('.get-all-saved-recs-button').click(() => {
  const url = `http://localhost:8080/recommendations`;
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        console.log(data, 'data in onGetAllRecsClick');
        displayAllBookRecommendations(data)
      },
      error: function(err) {
        console.error(err);
      }
    })
})

function displayAllBookRecommendations(data) {
  const recArray = data.recommendations;

  recArray.forEach((rec) => {
    $('.js-all-book-recommendations-results').append(

      `
      <div class="saved-recommendations">
      <p>Feelings Entry: ${rec.entryText}</p>
      <p>Title: ${rec.title}</p>
       <p>Author: ${rec.author}</p>
       <p>Description: ${rec.description}</p>

       <img src="${rec.image}" alt="image of ${rec.title}">
      <button data-id=${rec.id} class="delete-button">delete</button>
      </div>
      `
    )
  })
}

//delete recommendation from saved recommendations
$(".js-all-book-recommendations-results").on("click", ".delete-button", deleteRecommendation);

function deleteRecommendation() {
  const id = $(this).data('id');
    console.log(id)
  console.log('inside deleteRecs')

  const url = `http://localhost:8080/recommendations/${id}`;

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
  const author = $(this).data('author');
  const description = $(this).data('description');
  const image = $(this).data('image');
  const id = $(this).data('id');

  //make get call to update db entry for savedbook

  const url = `http://localhost:8080/recommendations/${id}`;
  console.log(url, 'update/ put url here')
    $.ajax({
      url: url,
      type: 'PUT',
      data: {
        "id": id,
        "title": title,
        "author": author,
        "description": description,
        "image": image
      },
      success: function(data) {
        console.log('SUCCESS!')
      },
      error: function(err) {
        console.error(err);
      }
    })
}

$(".js-most-recent-recommendations-results").on('click', '.save-book-button', saveBookAndUpdateDb);


//google books api call
function googleBookSearchForTitles(keyWords, entryText, id) {
  //make api call to return title, bookId, author, description, thumbnail image
  // const apiKey = GOOGLE_API_KEY;
  const apiKey = 'AIzaSyD1sCrYVwhHVJT17fJf5mRFohJNIfIEV9I';

  let searchTerms = keyWords.join("+") || entryText.split(" ").join("+");

  const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerms}&key=${apiKey}&country=US`
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      success: function(data) {

        const recommendations = [];

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
  const results = $('.js-most-recent-recommendations-results');

  results.empty();

  recommendations.forEach((recommendation, index) => {
    $('.js-most-recent-recommendations-results').append(
      `
      <p>${recommendation.title}</p>
      <p>${recommendation.author}</p>
      <p>${recommendation.description}</p>
      <img src="${recommendation.image}">
      <button class="save-book-button" data-id="${id}" data-title="${recommendation.title}" data-author="${recommendation.author}" data-description="${recommendation.description}" data-image="${recommendation.image}">save</button>
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
      const keyWords = [];
      data.annotations.forEach((word) => {
        keyWords.push(word.spot);
      })
      console.log(keyWords, 'keyWords here')
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

  const attrPresence = $('.js-entryText').attr('hidden')
  if (!attrPresence) {
      $('.js-entryText').empty();
  }

  const url = `http://localhost:8080/recommendations`;

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

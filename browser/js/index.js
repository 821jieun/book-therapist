//post

function extractEntities(data) {
    const text = encodeURIComponent(entryText);
    const token = '2e0335e9f4b440f7aa8283398c390d69';
    const entryText = data.entryText;
    const id = data.id;
    const baseUrl = `https://api.dandelion.eu/datatxt/nex/v1/?text`

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


function googleBookSearchForTitles(keyWords, entryText, id) {
  //make api call to return titles, bookId, author, description
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

        console.log('recommendations here: ', recommendations);
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

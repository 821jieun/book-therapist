
//post
function displayEntryText(data) {
  const entryText = data.entryText;
  // const textToInsert = `feelings entry: ${entryText}`;
  // const entryTextOuput = $('.js-entryText');

  // entryTextOuput
  //   .prop('hidden', false)
  //   .append(`<p></p>`)
  //
  // $('.js-entryText p').html(textToInsert);

  extractEntities(entryText);

}

function extractEntities(entryText) {
    const text = encodeURIComponent(entryText);
    const token = '2e0335e9f4b440f7aa8283398c390d69';
    const baseUrl = `https://api.dandelion.eu/datatxt/nex/v1/?text`

    $.ajax({
    url: `${baseUrl}=${text}&token=${token}`,
    dataType: 'json',
    type: 'GET',
    success: function(data) {
      // console.log(data)
      const keyWords = [];
      data.annotations.forEach((word) => {
        keyWords.push(word.spot);
      })
      console.log(keyWords, 'keyWords here')
      googleBookSearchForTitles(keyWords, entryText);

    },
    error: function(err) {
      console.log(err);
       }
  });

}


function googleBookSearchForTitles(keyWords, entryText) {
  //make api call to return titles, bookId, author, description
  const apiKey = 'AIzaSyD1sCrYVwhHVJT17fJf5mRFohJNIfIEV9I';

  let searchTerms = keyWords.join("+") || entryText.split(" ").join("+");

  console.log(searchTerms);

  const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerms}&key=${apiKey}&country=US`
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      success: function(data) {

        const recommendations = [];

        data.items.forEach((result) => {
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
        displayBookRecommendations(recommendations)
      },
      error: function(err) {
        console.log(err);
         }
    });
}

function displayBookRecommendations(recommendations) {

  const results = $('.js-most-recent-recommendations-results');

  results.empty();

  recommendations.forEach((recommendation) => {

    $('.js-most-recent-recommendations-results').append(
      `<p>${recommendation.title}</p>
      <p>${recommendation.author}</p>
      <p>${recommendation.description}</p>
      <img src="${recommendation.image}">
      <button class="save-book-button">save</button>

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
        console.log(data, 'data in ajax call post');
        displayEntryText(data);
      },
      error: function(err) {
        console.error(err);
      }
    })

  });
}

$(handleEntrySubmitForm());

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
        const recommendations = [];
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
        console.log(recommendations, 'recommendations from google api')
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
        <div class="book-component"><p class="rec-title">Title: ${recommendation.title}</p>
      </div>
      <div class="book-component">
        <p class="rec-author">Author: ${recommendation.author}</p>
      </div>
      <div class="book-component">
        <p class="rec-description">Description: ${checkStrLength(recommendation.description)}</p>
      </div>
      <div class="rec-thumbnail-image book-component">
        <img src="${recommendation.image}" alt="thumbnail of ${recommendation.title}">
      </div>
      <br />
      <div class="book-component">
        <button class="save-book-button" bookid=${recommendation.bookId} data-id="${id}" data-bookId="${recommendation.bookId}" data-title="${recommendation.title}" data-author="${recommendation.author}" data-description="${recommendation.description}" data-image="${recommendation.image}">save</button>
        </div>
      </div>
      `
    )
  })
}

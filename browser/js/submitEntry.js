function extractEntities(entryText) {
  //make api call to entity extractor
  //returning keyWords
  analyzeSentimentOfEntry(keyWords, entryText)
}

function analyzeSentimentOfEntry(keyWords, entryText) {
  //make api call to sentiment detector
  //const sentiment = returned sentiment of entry  from api call

  const queryString = `${keyWords}${sentiment}`
  googleBookSearchForTitles(queryString, entryText)
}

function googleBookSearchForTitles(queryString, entryText) {
  //make api call to return titles, bookId, author
  //const bookData = {
  //"results": [
  // {
  //  // title: title,
      // author: author,
      // bookId: bookId,
      //entryText: entryText
  // },
  // {
  //  // title: title,
      // author: author,
      // bookId: bookId,
      //entryText: entryText
  // },
  // {
  //  // title: title,
      // author: author,
      // bookId: bookId,
      //entryText: entryText
  // }
// ]

// }
  googleBookSearchForDescription(bookId, bookData)
}

function googleBookSearchForDescription(bookId, bookData) {
  //make api call with bookID to return description of book and update bookData
  //const bookData = {
  //"results": [
  // {
  //  // title: title,
      // author: author,
      // bookId: bookId,
      //entryText: entryText,
      // description: description
  // },
  // {
  //  // title: title,
      // author: author,
      // bookId: bookId,
      //entryText: entryText,
      // description: description
  // },
  // {
  //  // title: title,
      // author: author,
      // bookId: bookId,
      //entryText: entryText,
      // description: description
  // }
// ]

  displayBookRecommendations(bookData)
}

function displayBookRecommendations(data) {
  for (index in data.results) {
    $('.js-all-book-recommendations-results').append(
      `<p>${data.bookRecommendations[index].title}</p>
      <p>${data.bookRecommendations[index].author}</p>
      <p>${data.bookRecommendations[index].description}</p>
        <button>save</button>`
    )
  }
}

function handleEntrySubmitForm() {
  $('#js-sentiment-entry-form').submit((e) => {
  event.preventDefault();
  const entryText = $('#sentiment-input').val();
  $('#sentiment-input').val('');
  //TODO: create a post with this entryText in the database
  extractEntities(entryText)
});
}

$(handleEntrySubmitForm());

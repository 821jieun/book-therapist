function extractEntities(entryText) {
  //make api call to entity extractor
  //returning keyWords
  analyzeSentimentOfEntry(keyWords, entryText)
}

function analyzeSentimentOfEntry(keyWords, entryText) {
  //make api call to sentiment detector
  //const sentiment = returned sentiment of entry  from api call

  const queryString = `${keyWords}${sentiment}`
  googleBookSearchForTitles(queryString)
}

function googleBookSearchForTitles(queryString, bookData) {
  //make api call to return titles, bookId, author
  //const bookData = {
  // title: title,
  // author: author,
  // bookId: bookId
// }
  googleBookSearchForDescription(bookId, bookData)
}

function googleBookSearchForDescription(bookId, bookData) {
  //make api call with bookID to return description of book and update bookData
  //const bookData = {
  // title: title,
  // author: author,
  // bookId: bookId,
  // description: description
// }
}

function handleEntrySubmitForm() {
  $('#js-sentiment-entry-form').submit((e) => {
  event.preventDefault();
  const entryText = $('#sentiment-input').val();
  $('#sentiment-input').val('');
  extractEntities(entryText)
});
}

$(handleEntrySubmitForm());

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
  //make api call to entity extractor
  //returning keyWords
  // analyzeSentimentOfEntry(keyWords, entryText)
}

// function analyzeSentimentOfEntry(entryText) {
//   //make api call to sentiment detector
//   let sentiment;
//   const text = encodeURIComponent(entryText);
//   const url = `https://api.dandelion.eu/datatxt/sent/v1/?lang=en&text=`;
//   const token ='2e0335e9f4b440f7aa8283398c390d69';
//
//   $.ajax({
//     url: `${url}=${text}&token=${token}`,
//     dataType: 'json',
//     type: 'GET',
//     success: function(data) {
//       sentiment = data.sentiment.type;
//       if (sentiment === "negative") {
//         sentiment = "how to handle"
//       }
//
//       if (sentiment === "positive") {
//         sentiment = "exploring"
//       }
//       const queryString = `${sentiment} ${entryText}`
//       googleBookSearchForTitles(queryString)
//     },
//     error: function(err) {
//       console.log(err);
//        }
//   });
// }

function googleBookSearchForTitles(keyWords, entryText) {
  //make api call to return titles, bookId, author, description
  const apiKey = 'AIzaSyD1sCrYVwhHVJT17fJf5mRFohJNIfIEV9I';

  let searchTerms = keyWords.join("+") || entryText.split(" ").join("+");

  console.log(searchTerms);

  const url = `https://www.googleapis.com/books/v1/volumes?q="${searchTerms}"&key=${apiKey}&country=US`
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        console.log(data)
        // googleBookSearchForDescription(bookId, bookData)
      },
      error: function(err) {
        console.log(err);
         }
    });
  //const bookData = {
  //"results": [
  // {
  //  // title: title (results.volumeInfo.title),
      // author: author (results.volumeInfo.authors),
      // bookId: bookId (results.id),
      // description: results.volumeInfo.description,
       // image: results.imageLinks.thumbnail
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
  // displayBookRecommendations(bookData)
}

//
// function displayBookRecommendations(data) {
//   for (index in data.results) {
//     $('.js-all-book-recommendations-results').append(
//       `<p>${data.bookRecommendations[index].title}</p>
//       <p>${data.bookRecommendations[index].author}</p>
//       <p>${data.bookRecommendations[index].description}</p>
        // <img src="${data.bookRecommendations[index].image}">`
//     )
//   }
// }
//

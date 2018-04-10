const MOCK_BOOK_RECOMMENDATIONS = {
  "bookRecommendations": [
    {
      "bookId": "abc",
      "title": "the stranger",
      "author": "albert camus",
      "description": "Meursault, the narrator, is a young man living in Algiers. After receiving a telegram informing him of his mother's death, he takes a bus to Marengo, where his mother had been living in an old persons' home. He sleeps for almost the entire trip. When he arrives, he speaks to the director of the home.",
      "entryText": "feeling very anti-social"
    },
    {
      "bookId": "def",
      "title": "the golden notebook",
      "author": "doris lessing",
      "description":  "Lessing, in her preface, claimed the most important theme in the novel is fragmentation; the mental breakdown that Anna suffers, perhaps from the compartmentalization of her life reflected in the division of the four notebooks, but also reflecting the fragmentation of society. Her relationship and attempt to draw everything together in the golden notebook at the end of the novel are both the final stage of her intolerable mental breakdown, and her attempt to overcome the fragmentation and madness.",
      "entryText": "i feel like i am fragmenting into a million pieces"
    },
    {
      "bookId": "ghi",
      "title": "the little prince",
      "author": "antoine de saint-exupéry",
      "description": "Though ostensibly styled as a children's book, The Little Prince makes several observations about life and human nature. For example, Saint-Exupéry tells of a fox meeting the young prince during his travels on Earth. The story's essence is contained in the fox saying that 'One sees clearly only with the heart. The essential is invisible to the eye'.",
      "entryText": "i feel cynical and sad"
    }
  ]
};

function getAllBookRecommendations(callbackFn) {
  //make an ajax call to the /recommendations endpoint
  const url = 'http://localhost:8080/recommendations';
  $.ajax({
    url: url,
    dataType: 'json',
    type: 'GET',
    success: function(data) {
      console.log('inside the success of ajax call')
    },
    error: function(err) {
      const errorMessage = err.responseJSON.msg;
      const outputElem = $(".js-all-book-recommendations-results");
      outputElem
        .prop('hidden', false)
        .html(`<p>${errorMessage}</p>`)
    }
  })
}

// function displayAllBookRecommendations(data) {
//   for (index in data.bookRecommendations) {
//     $('.js-all-book-recommendations-results').append(
//       `<p>${data.bookRecommendations[index].title}</p>`
//     )
//   }
// }

function displayEntryText(data) {
  const entryText = data.entryText;
  const entryTextOuput = $('.js-entryText')
  // $('.js-entryText').append(
  //   `<p>${entryText}</p><button class="book-please-button">book, please</button>`
  // )
  entryTextOuput
    .prop('hidden', false)
    .append(`<p></p><button class="book-please-button">book, please</button>`)

  $('.js-entryText p').html(entryText)

    extractEntities(entryText);
    // analyzeSentimentOfEntry(entryText)
    // googleBookSearchForTitles(entryText);
}

// function getAndDisplayBookRecommendations() {
//   getAllBookRecommendations(displayAllBookRecommendations);
// }
// $(".js-entryText").on('click', '.book-please-button', onAnnotatedLinkClick);

function handleEntrySubmitForm() {
  $('#js-sentiment-entry-form').submit((e) => {
  event.preventDefault();
  const entryText = $('#sentiment-input').val();

  $('#sentiment-input').val('');

const attrPresence = $('.js-entryText').attr('hidden')
console.log(attrPresence, 'attr Presence here')
if (!attrPresence) {
    // $('.js-entryText').html('');
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

// $(function() {
//   getAndDisplayBookRecommendations();
// });

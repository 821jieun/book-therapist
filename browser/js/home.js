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
  setTimeout(function() {
    callbackFn(MOCK_BOOK_RECOMMENDATIONS)
  }, 100);
}

function displayAllBookRecommendations(data) {
  for (index in data.bookRecommendations) {
    $('.js-all-book-recommendations-results').append(
      `<p>${data.bookRecommendations[index].title}</p>`
    )
  }
}

function getAndDisplayBookRecommendations() {
  getAllBookRecommendations(displayAllBookRecommendations);
}

$(function() {
  getAndDisplayBookRecommendations();
});

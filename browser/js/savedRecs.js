//get all saved recommendations
function displayAllBookRecommendations(data) {
  const recArray = data.recommendations;

  recArray.forEach((rec) => {
    //TODO add created key/value to recommendations data
    //TODO hook up delete route
    $('.js-all-book-recommendations-results').append(
      `<p>${rec.entryText}</p>
      <button class="delete">delete</button>
      `
    )
  })



}
function getAndDisplayBookRecommendations() {
  getAllBookRecommendations(displayAllBookRecommendations);
}

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

function saveBookAndUpdateDb() {
  console.log('inside saveBookAndUpdateDb')
  //make get call to update db entry for savedbook

}

$(".js-most-recent-recommendations-results").on('click', '.save-book-button', saveBookAndUpdateDb);

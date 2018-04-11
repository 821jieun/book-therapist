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

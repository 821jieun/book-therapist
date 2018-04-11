//get all saved recommendations
function displayAllBookRecommendations(data) {
  const recArray = data.recommendations;

  recArray.forEach((rec) => {
    //TODO hook up delete route
    $('.js-all-book-recommendations-results').append(

      `
      <div class="saved-recommendations">
      <p>${rec.title}</p>
       <p>${rec.author}</p>
       <p>${rec.description}</p>
       <p>${rec.entryText}</p>
       <img src="${rec.image}">
      <button data-id=${rec.id} class="delete-button">delete</button>
      </div>
      `
    )

  })


}

$(".js-all-book-recommendations-results").on("click", ".delete-button", deleteRecommendation);


function deleteRecommendation() {
  const id = $(this).data('id');
    console.log(id)
  console.log('inside deleteRecs')

  const url = `http://localhost:8080/recommendations/${id}`;

    $.ajax({
      url: url,
      type: 'DELETE',
      success: function(data) {
        console.log('successfully deleted!');
      },
      error: function(err) {
        console.error(err);
      }
    })
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

//update entryText with book's info user clicked to save
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

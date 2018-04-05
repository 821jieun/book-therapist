console.info('Signup JS, config is:', APP)

const SIGNUP_FORM = $('#js-signup-form')
const SIGNUP_MESSAGE_CONTAINER = $('#signup-message')

const SIGNUP_URL = `${APP.API_URL}/signup`

function handleAPIResponse(response) {

    //response has status and code fileds, see server.js
    if (response.status === "OK") {
        SIGNUP_MESSAGE_CONTAINER.html(
        `<p>
         Success! You may now <a href="/login.html">login</a>.
        </p>
        `)
    } else {
        SIGNUP_MESSAGE_CONTAINER.html(
            `
            <p>There was an error with code: ${response.code}</p>
            <p>Hint: try username <strong>Jieun</strong> and password <strong>letmein</strong></p>    
            `)
    }
}

function apiSignup(formData, successCallback, errorCallback) {
    //POST to the server
    $.ajax({
        dataType: 'json',
        method: 'post',
        url: SIGNUP_URL,
        data: formData,
        success: data => successCallback(data),
        error: xhr => errorCallback(xhr.responseJSON),
    })
}


function setupFormHandlers() {
    SIGNUP_FORM.submit(function(e) {
        e.preventDefault()

        const ids = 'username-input password-input'.split(' ')
        let formData = {}
        ids.forEach(id => {
            let value = $(`#${id}`).val()
            const shortId = id.replace('-input', '')
            formData[shortId] = value
        })

        console.log('submit!', formData)
        apiSignup(formData, handleAPIResponse, handleAPIResponse)

        return false
    })

}

// main
setupFormHandlers()
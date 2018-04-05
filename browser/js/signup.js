console.info('Signup JS, config is:', APP)

const SIGNUP_FORM = $('#js-signup-form')
const SIGNUP_URL = `${APP.API_URL}/signup`

function apiSignup(formData, successCallback, errorCallback){
    //POST to the server
    $.ajax({
        dataType:'json',
        method:'post',
        url:SIGNUP_URL,
        data:formData,
        success:successCallback,
        error:errorCallback,
    })
}      
        

function setupFormHandlers(){
SIGNUP_FORM.submit( function(e){
e.preventDefault()

const ids = 'username-input password-input'.split(' ')
let formData = {}
ids.forEach(id=>{
    let value = $(`#${id}`).val()
    formData[id]=value
})

console.log('submit!', formData)

apiSignup(formData, (resp)=>{
    console.log('Success!', resp)
})

return false
})

}

// main
setupFormHandlers()
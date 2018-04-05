const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(morgan('common'));
app.use(express.static('browser'));


// parse application/x-www-form-urlencoded as sent by our API consumers
const inputParser = bodyParser.urlencoded({ extended: false })

app.get('/api/recommendations', (inputParser, req, res) => {
    // TODO
});
app.get('/api/login', (inputParser, req, res) => {
    // TODO
});
app.post('/api/signup', inputParser, (req, res) => {
    console.log('/api/signup:', req.body)

    //extract body.username and body.password
    const { username, password } = req.body
    
    //this is where the logic resides, checking wether input is valid and the username/e-mail does not already exist
    //there may be more stuff to do, like sending an actication e-mail
    
    //TODO remove this mock
    //TODO check for valid data and store the new user
    if (username === 'Jieun' && password === 'letmein') {

        // send HTTP status code 200 OK and finish processing this request
        // the status and code in the response are just fields I made up
        // they have nothing to do with HTTP status codes, this is the DSL of our API
        res.json({ status: "OK" }, 200).end()
    }
    res.json({ status: "ERROR", code: "ALREADY_SIGNED_UP" }, 400).end()

});

app.get('*', (req, res) => {
    res.json('not found');
});

let server;

function runServer() {
    const port = process.env.PORT || 8080;

    return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
            console.log(`listening attentively on port ${port}`);
            resolve(server);
        }).on('error', err => {
            reject(err);
        });
    });
}

function closeServer() {
    return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
};

module.exports = { app, runServer, closeServer };
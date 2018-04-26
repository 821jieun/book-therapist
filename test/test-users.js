'use strict';

const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const User = require('../src/user/model.user');


// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('/user', function() {
  const username = 'betty@boop.com';
  const password = 'doopdoopshedoop';
  const firstName = 'betty';
  const lastName = 'boop';
  const usernameB = 'straw@berry.com';
  const passwordB = 'shortcake';
  const firstNameB = 'strawberry';
  const lastNameB = 'galore';

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {});

  afterEach(function() {
    return User.remove({});
  });

  describe('/user/register', function() {
     describe('POST', function() {
       // console.log('consoleloooooog where are yoouuuu')
       it('Should reject users with missing username', function() {
         return chai
           .request(app)
           .post('/user/register')
           .send({
             password,
             firstName,
             lastName
           })
           .then(() =>
             expect.fail(null, null, 'Request should not succeed')
           )
           .catch(err => {
             if (err instanceof chai.AssertionError) {
               throw err;
             }

             const res = err.response;
             // console.log(res.body, 'res dot body investigation')

             expect(res).to.have.status(422);
             expect(res.body.reason).to.equal('ValidationError');
             expect(res.body.message).to.equal('Missing field');
             expect(res.body.location).to.equal('username');
           });
       });

      it('Should reject users with missing password', function() {
        return chai
          .request(app)
          .post('/user/register')
          .send({
            username,
            firstName,
            lastName
          })
          .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Missing field');
          expect(res.body.location).to.equal('password');
        });

      });

     });

   });

});

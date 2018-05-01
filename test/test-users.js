'use strict';

const chai = require('chai');
const expect = require('chai').expect;
const should = require('chai').should();
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const User = require('../src/user/model.user');

chai.use(chaiHttp);

describe('Protected endpoint', function() {
    const username = 'betty@boop.com';
    const password = 'doopdoopshedoop';
    const firstName = 'betty';
    const lastName = 'boop';

    before(function() {
      return runServer(TEST_DATABASE_URL);
    });

    after(function() {
      return closeServer();
    });

    beforeEach(function() {
      return bcrypt.hash(password, 10)
      .then(hashed => {
        User.create({
          username: username,
          password: hashed,
          firstName: firstName,
          lastName: lastName
        })
      })

    });

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

        it('Should reject users with non-string username', function() {
        return chai
          .request(app)
          .post('/user/register')
          .send({
            username: 1234,
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
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('username');
          });
      });
      it('Should reject users with non-string password', function() {
        return chai
          .request(app)
          .post('/user/register')
          .send({
            username,
            password: 1234,
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
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('password');
          });
      });
      it('Should reject users with non-string first name', function() {
        return chai
          .request(app)
          .post('/user/register')
          .send({
            username,
            password,
            firstName: 1234,
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
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('firstName');
          });
      });

      it('Should reject users with non-string last name', function() {
        return chai
          .request(app)
          .post('/user/register')
          .send({
            username,
            password,
            firstName,
            lastName: 1234
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
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('lastName');
          });
      });
      it('Should reject requests with an invalid token', function() {
        const token = jwt.sign(
          {
            username,
            firstName,
            lastName
          },
          'wrongSecret',
          {
            algorithm: 'HS256',
            expiresIn: '7d'
          }
        );

        return chai
          .request(app)
          .get('/user/register')
          .set('Authorization', `Bearer ${token}`)
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(401);
          });
        });
      });
  });
});

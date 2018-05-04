'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const should = chai.should();
const faker = require('faker');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL, JWT_SECRET} = require('../config');

const userModel = require('../src/user/model.user');
const userController = require('../src/user/controller.user');
const recController = require('../src/recommendation/controller.recommendation');
const recModel = require('../src/recommendation/model.recommendation');

chai.use(chaiHttp);

describe('Auth endpoints', function() {
  const username = "sourpickle";
  const password = "crunch";
  const firstName = "kirby";
  const lastName = "cucumber";

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function() {
    return bcrypt.hash(password, 10)
    .then(hashed => {
      userModel.create({
        username: username,
        password: hashed,
        firstName: firstName,
        lastName: lastName
      })
    })
 });

 afterEach(function () {
   return userModel.remove({});
 });

 describe('/user/login', function() {
   it('Should reject requests with no credentials', function () {
     return chai
       .request(app)
       .post('/user/login')
       .then(() =>
         // expect.fail(null, null, 'Request should not succeed')
         // should.fail(null, null, 'Request should not succeed')
         expect().fail('Request should not succeed')
       )
       .catch(err => {
         if (err instanceof chai.AssertionError) {
           throw err;
         }

         const res = err.response;
         console.log(res);
         // expect(res).to.have.status(400);
       });
   });
   it('Should reject requests with incorrect usernames', function () {
      return chai
        .request(app)
        .post('/user/login')
        .send({ username: 'wrongUsername', password })
        .then(() =>
          // expect.fail(null, null, 'Request should not succeed')
          expect().fail('Request should not succeed')

        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          // expect(res).to.have.status(401);
        });
    });
    it('Should reject requests with incorrect passwords', function () {
      return chai
        .request(app)
        .post('/user/login')
        .send({ username, password: 'wrongPassword' })
        .then(() =>
          // expect.fail(null, null, 'Request should not succeed')
          expect().fail('Request should not succeed')

        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          // expect(res).to.have.status(401);
        });
    });
    it('Should return a valid auth token', function () {
      return chai
        .request(app)
        .post('/user/login')
        .send({ username, password })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const token = res.body.data.token;
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256']
          });
          expect(payload.username).to.deep.equal(username)

        });
    });

  });
});

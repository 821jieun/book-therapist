'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
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

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedRecommendationData() {
  console.info('seeding recommendation data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      entryText: faker.lorem.sentence()
      // userId: faker.lorem.sentence()
    });
  }
  // this will return a promise
  return recModel.insertMany(seedData);
}

describe('Recommendations API', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedRecommendationData();
  });

  after(function() {
    return closeServer();
  });

  afterEach(function() {
    // userModel.remove({});
    tearDownDb();
  });

  describe(`Recommendations API`, function() {
    it('should list recommendations on GET', function() {
      const username = 'jollyturtle';
      const password = 'hexagon';
      const firstName = 'harold';
      const lastName = 'hoola';

      bcrypt.hash(password, 10)
      .then(hashed => {
        userModel.create({
          username: username,
          password: hashed,
          firstName: firstName,
          lastName: lastName
        })
      });

      let userToken = {
        username: userModel.username,
        id: userModel._id
      };

      let token = jwt.sign(userToken, process.env.JWT_SECRET);

      return chai.request(app)
        .get(`/recommendations/all/${token}`)
        .then(function(res) {
          // console.log(res.body.recommendations, 'res dot body dot recommendations!!!')
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.recommendations).to.be.a('array');
          expect(res.body.recommendations.length).to.be.above(0);
          res.body.recommendations.forEach(function(recommendation) {
            console.log(recommendation, 'recommendation here')
            console.log(Object.keys(recommendation), 'recommendation keys here')
            expect(recommendation).to.be.a('object');
            expect(recommendation).to.include.all.keys('id', 'entryText')
          });
          userModel.remove({});
        });
    });

    it('should add a recommendation on POST', function() {
      const username = 'jollyturtle';
      const password = 'hexagon';
      const firstName = 'harold';
      const lastName = 'hoola';

      bcrypt.hash(password, 10)
      .then(hashed => {
        userModel.create({
          username: username,
          password: hashed,
          firstName: firstName,
          lastName: lastName
        })
      });

      let userToken = {
        username: userModel.username,
        id: userModel._id
      };

      let token = jwt.sign(userToken, process.env.JWT_SECRET);

      const newPost = {
        entryText: faker.lorem.sentence(),
        userId: faker.lorem.sentence()
      };

      return chai.request(app)
        .post(`/recommendations/create/${token}`)
        .send(newPost)
        .then(function(res) {
          console.log(res, 'RES INSIDE')
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.entryText).to.equal(newPost.entryText);
          // expect(res.body.userId).to.equal(newPost.userId);
        });
    });
    //
    it('should error if POST missing expected values', function() {
      const username = 'jollyturtle';
      const password = 'hexagon';
      const firstName = 'harold';
      const lastName = 'hoola';

      bcrypt.hash(password, 10)
      .then(hashed => {
        userModel.create({
          username: username,
          password: hashed,
          firstName: firstName,
          lastName: lastName
        })
      });

      let userToken = {
        username: userModel.username,
        id: userModel._id
      };

      let token = jwt.sign(userToken, process.env.JWT_SECRET);

      const badRequestData = {};
      return chai.request(app)
        .post(`/recommendations/create/${token}`)
        .send(badRequestData)
        .catch(function(res) {
          expect(res).to.have.status(400);
        });
    });
    //
    it('should update recommendation on PUT', function() {
      const username = 'jollyturtle';
      const password = 'hexagon';
      const firstName = 'harold';
      const lastName = 'hoola';

      bcrypt.hash(password, 10)
      .then(hashed => {
        userModel.create({
          username: username,
          password: hashed,
          firstName: firstName,
          lastName: lastName
        })
      });

      let userToken = {
        username: userModel.username,
        id: userModel._id
      };

      let token = jwt.sign(userToken, process.env.JWT_SECRET);

      return chai.request(app)
        // first have to get
        .get(`/recommendations/all/${token}`)
        .then(function(res) {
          const updatedRec = Object.assign(res.body.recommendations[0], {
            title: faker.lorem.sentence(),
            author: faker.name.firstName(),
          });
          return chai.request(app)
            .put(`/recommendations/update/${res.body.recommendations[0].id}/${token}`)
            .send(updatedRec)
            .then(function(res) {
              expect(res).to.have.status(204);
            });
        });
    });

    it('should delete posts on DELETE', function() {
      const username = 'jollyturtle';
      const password = 'hexagon';
      const firstName = 'harold';
      const lastName = 'hoola';

      bcrypt.hash(password, 10)
      .then(hashed => {
        userModel.create({
          username: username,
          password: hashed,
          firstName: firstName,
          lastName: lastName
        })
      });

      let userToken = {
        username: userModel.username,
        id: userModel._id
      };

      let token = jwt.sign(userToken, process.env.JWT_SECRET);

      return chai.request(app)
        // first have to get
        .get(`/recommendations/all/${token}`)
        .then(function(res) {
          return chai.request(app)
            .delete(`/recommendations/delete/${res.body.recommendations[0].id}/${token}`)
            .then(function(res) {
              expect(res).to.have.status(204);
            });
        });
    });

  });

});

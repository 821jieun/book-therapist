'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const should = chai.should();
const expect = chai.expect;

const {RecList} = require('../models/recommendations.js');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
// console.log(TEST_DATABASE_URL, 'test database url here in tests')

chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedRecData() {
  console.info('seeding recommendations data');
  const seedData = [];
  for (let i = 1; i <= 6; i++) {
    seedData.push(generateRecData());
  }
  console.log(seedData, 'seedData in seedRecData()')

  return RecList.insertMany(seedData);
}

function generateEntryText() {
  const emotions = 'anger anxiety frustration, anticipation joy nervousness, disgust anger self-loathing, fear shame failure, joy triumph at the same time, sadness lorem ipsum, surprise sensations sensitivity, trust trouble tricks'.split(', ');
  return emotions[Math.floor(Math.random() * emotions.length)];
}

function generateTitle() {
  const titles = 'Lorem ipsum dolor sit amet, ut dolore nullam ius. Ad ius facer nostro patrioque. Vel in unum omnesque salutatus, ad consul noster definiebas vix, eripuit deseruisse ei pro. Sea saperet scriptorem et, pro cu percipit ocurreret dissentiunt. Inani accumsan iracundia no his.'.split(' ');
  return titles[Math.floor(Math.random() * titles.length)];
}

function generateAuthor() {
   const authors = 'Amanda Gaskell, Raven Ebarb, Deeanna Stelling, Loura Bowker, Vonnie Willingham, Aurora Musgrove, Sudie Nau, Fannie Sones, Dacia Heckert'.split(',');
   return authors[Math.floor(Math.random() * authors.length)];

}

function generateDescription() {
  const description = 'Adolescens intellegebat eos no, sint postulant his in, nec ea repudiandae interpretaris. An pri causae doctus nominavi, cum vidit partem vivendo an, quo ad lorem repudiare hendrerit. Cu vero accusamus scriptorem usu, legere antiopam mediocritatem an eum. Electram scriptorem no sea, graeco latine argumentum qui ad. Luptatum phaedrum et mei, pro ut quot ubique populo. Vis ne mucius temporibus.'
  return description;
}

function generateBookId() {
  const ids = 'jsd,kad,jfk,sjd,fiw,ejf,lsd,jaf,sdk,fjf,lsk,djf,asl,dkj,fas,ldk,fjs,ldk,fj'.split(',');
  return ids[Math.floor(Math.random() * ids.length)];
}

function generateRecData() {
  return {
      bookId: generateBookId(),
      title: generateTitle(),
      author: generateAuthor(),
      description: generateDescription(),
      entryText: generateEntryText()
    }
}

describe('Recommendations API resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedRecData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });


  describe('GET endpoint', function() {
    it('should return all existing recommendations', function() {
      let res;
      return chai.request(app)
        .get('/recommendations')
        .then((_res) => {
          res = _res;
          res.should.have.status(200);
          res.body.recommendations.should.have.lengthOf.at.least(1);
          return RecList.count();
        })
        .then((count) => {
          res.body.recommendations.should.have.lengthOf(count);
        });
    });
  });



});

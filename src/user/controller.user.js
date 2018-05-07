'use strict';

const User = require('./model.user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config');

exports.registerUser = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  const fieldShouldBeStrings = ['username', 'password', 'firstName', 'lastName'];
  const notAString = fieldShouldBeStrings.find((field) => {
      field in req.body && typeof req.body[field] !== 'string'
    }
  );

  if (notAString) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  //check to see if user is in the db by email
  User.findOne({
    username: username
  })
  .then((user) => {
    //if user already exists, send an error message
    if (user) {
      res.status(401).json({
        message: 'this user already exists in the db'
      })
      return;
    }
    //user doesn't exist (code never hit line 19)
    //so we encrypt the password (asynchronous)
    bcrypt.hash(password, 10)
    .then(hashed => {
      User.create({
        username: username,
        password: hashed,
        firstName: firstName,
        lastName: lastName
      })
      .then((user) => {
        res.status(201).json({
          message: 'this user has been successfully registered!',
          data: user
        })
      })
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err))

  })
  .catch((err) => {
    console.log(err);
  })
}


exports.loginUser = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  //check to see if user is in the db by email
  User.findOne({
    username: username
  })
  .then((user) => {
    //if user does not exist, send an error message
    if (!user) {
      res.status(401).json({
        message: 'this user does not exist in the db'
      })
      return;
    }
    //check if password matches

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      res.status(401).json({
        message: 'this password does not match'
      })
      return;
    }
    //at this point, the user exists ANd the passwords are the same
    //token is created!
    let userToken = {
      username: user.username,
      id: user._id
    };

    let token = jwt.sign(userToken, config.JWT_SECRET);

    res.status(200).json({
      message: 'user logged in successfully',
      data: {
        token: token,
        userId: user._id,
        username: user.username
      }
    })
  })
  .catch((err) => {
    console.log(err);
  })
}

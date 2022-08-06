'use strict';

const express = require('express');
// const { asyncHandler } = require('./middleware/async-handler');
const { User } = require('./models');
// const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();


/* We use this piece of middleware to prevent having to use try-catch blocks
for every single route*/
function asyncHandler(cb) {
    return async (req, res, next) => {
      try {
        await cb(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  }




// Route that returns a list of users.
/*The authenticateUser middleware function will set the currentUser property 
on the Request object if and only if the request is successfully authenticated. 
We can use the currentUser property with confidence because our inline route handler 
function will never be called if the request doesn't successfully authenticate.*/
router.get('/users', asyncHandler(async (req, res) => {
const user = req.currentUser;

res.json({
  name: user.name,
  username: user.username
});
}));



// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).json({ "message": "Account successfully created!" });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));


module.exports = router;
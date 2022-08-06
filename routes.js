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
  firstName: user.firstName,
  lastName: user.lastName
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




  // Send a GET request to /quotes to READ a list of quotes
  router.get("/courses", async (req, res) => {
    try {
      const quotes = await records.getQuotes();
      res.json(quotes);
    } catch (err) {
      res.json({ message: err.message });
    }
  });
  // Send a GET request to /quotes/:id to READ(view) a quote
  //this get method returns a single quote
  
  router.get("/courses/:id", async (req, res) => {
    try {
      const quote = await records.getQuote(req.params.id);
      if (quote) {
        res.json(quote);
      } else {
        res.status(404).json({ message: "Quote not found." });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

  // Send a POST request to /quotes to  CREATE a new course
  /*Because we want to await the creation of a record inside of this anonymous function, the
  anonymous function needs to be asynchronous.*/
  router.post(
    "/courses",
    asyncHandler(async (req, res) => {
        try {
            await Course.create(req.body);
            res.status(201).json({ "message": "Course successfully created!" });
          } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
              const errors = error.errors.map(err => err.message);
              res.status(400).json({ errors });   
            } else {
              throw error;
            }
          }
        }));

  // Send a PUT request to /quotes/:id to UPDATE (edit) a quote
  router.put(
    "/courses/:id",
    asyncHandler(async (req, res, next) => {
        try {
            await Course.update(req.body);
            res.status(201).json({ "message": "Course successfully updated!" });
          } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
              const errors = error.errors.map(err => err.message);
              res.status(400).json({ errors });   
            } else {
              throw error;
            }
          }
        }));



  // Send a DELETE request to /quotes/:id DELETE a quote
  router.delete("/courses/:id", async (req, res, next) => {
    try {
      throw new Error("Something terrible happened!");
      const quote = await records.getQuote(req.params.id);
      await records.deleteQuote(quote);
      res.status(204).end();
    } catch (err) {
      /*Inside our catch block, instead of manually changing the status code and setting an error message as we were,
      res.status(500).json({message: err.message});
      we can simply pass the error to our global error handler using the express function, next. Because we're passing
      next at parameter, express knows to run our global error handler next and it will pass along the error message*/
      next(err);
    }
  });










module.exports = router;
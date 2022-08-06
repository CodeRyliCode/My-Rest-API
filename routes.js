'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();




// Route that returns a list of users.
/*The authenticateUser middleware function will set the currentUser property 
on the Request object if and only if the request is successfully authenticated. 
We can use the currentUser property with confidence because our inline route handler 
function will never be called if the request doesn't successfully authenticate.*/
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
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
  router.get("/courses", asyncHandler(async (req, res) => {
    res.location = '/';
    const course = await Course.findAll();
        res.json(course)
    
    }));
    
    
  // Send a GET request to /quotes/:id to READ(view) a quote
  //this get method returns a single quote
  
  router.get("/courses/:id", asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      if (course) {
        res.json(course);
      } else {
        res.status(404).json({ message: "Course not found." });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }));
  

  // Send a POST request to /quotes to  CREATE a new course
  /*Because we want to await the creation of a record inside of this anonymous function, the
  anonymous function needs to be asynchronous.*/
  router.post(
    "/courses", authenticateUser, 
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
    "/courses/:id", authenticateUser, 
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
  router.delete("/courses/:id", authenticateUser, asyncHandler(async (req, res, next) => {
    try {
        const course = await Course.findByPk(req.params.id);
      } catch (error) {
        if (course) {
            await course.destroy();
            res.redirect("/courses");
          } else {
            res.sendStatus(404);
          }
      
    }
}));










module.exports = router;
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
const currentUser = req.currentUser;

res.json({
  id: currentUser.id,
  firstName: currentUser.firstName,
  lastName: currentUser.lastName,
  emailAddress: currentUser.emailAddress,
});
}));



// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.location('/');    
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));




  // Send a GET request to /quotes to READ a list of courses
  router.get(
    "/courses",
    asyncHandler(async (req, res) => {
      const course = await Course.findAll({
        include: [
          {
            model: User,
          },
        ],
      });
      if (course) {
        res.status(200).json(course);
      } else {
        res.status(404).json({ message: "Course not found" });
      }
    })
  );

  // Send a GET request to /quotes/:id to READ(view) a quote
  //this get method returns a single quote
  
  router.get(
    "/courses/:id",
    asyncHandler(async (req, res) => {
      const course = await Course.findByPk(req.params.id, {
        include: [
          {
            model: User,
          },
        ],
      });
      if (course) {
        res.status(200).json(course);
      } else {
        res.status(404).json({ message: "Course not found" });
      }
    })
  );
  
  

  // Send a POST request to /quotes to  CREATE a new course
  /*Because we want to await the creation of a record inside of this anonymous function, the
  anonymous function needs to be asynchronous.*/
  router.post(
    "/courses", authenticateUser, 
    asyncHandler(async (req, res) => {
        try {
          const course = await Course.create(req.body);
          res.location(`/courses/${course.id}`);
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
    authenticateUser,
    asyncHandler(async (req, res) => {
      try {
        let course = await Course.findByPk(req.params.id);
        if (course) {
          await course.update(req.body);
          res.status(204).end();
        } else {
          res.status(404).json();
        }
      } catch (error) {
        if (
          error.name === "SequelizeValidationError" ||
          error.name === "SequelizeUniqueConstraintError"
        ) {
          const errors = error.errors.map((err) => err.message);
          res.status(400).json({ errors });
        } else {
          throw error;
        };
      }
    })
  );
  

  // Send a DELETE request to /quotes/:id DELETE a quote
  router.delete("/courses/:id", authenticateUser, asyncHandler(async (req, res, next) => {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            await course.destroy();
            res.status(204).end();
        } else {
            res.status(404);
          }
      
    })
  );










module.exports = router;
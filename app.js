'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const { sequelize } = require('./models');
const routes = require('./routes');
// create the Express app
const app = express();
// Setup request body JSON parsing.
app.use(express.json());



// setup morgan which gives us http request logging
app.use(morgan('dev'));

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

app.use('/api', routes);



// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});


// Setup a global error handler.
app.use((err, req, res, next) => {
  console.error(`Global error handler: ${JSON.stringify(err.stack)}`);

  res.status(500).json({
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});


// set our port
app.set('port', process.env.PORT || 5000);

// Sequelize model synchronization, then start listening on our port.
sequelize.sync()
  .then( () => {
// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
  });

// // The dialect parameter specifies the specific version of SQL you're 
// // using (the SQL dialect of the database), which in this case it's 
// // sqlite. Since SQLite is a file-based database that doesn't require 
// // credentials or a host, you use the storage key to specify the file 
// // path or the storage engine for SQLite. The value 'library.db' is 
// // what we are using'.
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: 'library.db',
//   logging: false

// });



// async IIFE
(async () => {
  // Sync all tables

  try {
    await sequelize.authenticate();
    // await sequelize.sync({ force: true });
    console.log("Connection to the database successful!");

  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errors = error.errors.map((err) => err.message);
      console.error("Validation errors: ", errors);
  } else {
    throw error;
  }
}

})();

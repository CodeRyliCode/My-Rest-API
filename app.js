'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');

const Sequelize = require('sequelize');


// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

// The dialect parameter specifies the specific version of SQL you're 
// using (the SQL dialect of the database), which in this case it's 
// sqlite. Since SQLite is a file-based database that doesn't require 
// credentials or a host, you use the storage key to specify the file 
// path or the storage engine for SQLite. The value 'library.db' is 
// what we are using'.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db',
  logging: false

});



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

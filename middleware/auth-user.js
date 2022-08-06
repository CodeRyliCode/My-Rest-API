'use strict';
//import the basic-auth module:
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const { User } = require('../models');



/*Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser exports the middleware function so that you're 
able to import it from within another module. The next() function passes 
execution to the next middleware.*/
exports.authenticateUser = async (req, res, next) => {
    let message; //store the message to display
    //parse the user's credentials from the authorization header.
    const credentials = auth(req);
//  // If the user's credentials are available...
    if(credentials) {
        /*find a user account whose username property matches the user 
        credential's name property. Assign the user returned by User.findOne() to the variable user:*/
const user = await User.findOne({ where: {username: credentials.name} });
if(user) {
/*use the bcrypt compareSync() method to compare the user's password 
(from the Authorization header) to the encrypted password retrieved from 
the database. Assign the result to the variable authenticated:*/
    const authenticated = bcryptjs
    .compareSync(credentials.pass, user.confirmedPassword);
    if (authenticated) { //if the passwords match
console.log( `Authentication successul for username: ${user.username}`);

/*store the user on the request object
req.currentUser means that you're adding a property named currentUser 
to the request object and setting it to the authenticated user.*/
req.currentUser = user;
    } else {
        message = `Authentication failure for username: ${user.username}`;
    }
} else {
    message = `User not found for username: ${credentials.name}`;
}
    } else {
        message = 'Auth header not found';
    } 
    if(message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {

    next();
}
};

/*In this step, we'll use the basic-auth npm package to do all of the user credential parsing for us:
npm install basic-auth

Suppose the message variable has a value. In that case, we know that a failure occurred. 
In the above code, we log the message to the console (for debugging purposes) and return a 
401 Unauthorized HTTP status code and a generic "Access Denied" message in the response body.
If the client makes a request to a protected route but doesn't provide an Authorization header 
value, or if verification of the user's key or secret fails, our authenticateUser() middleware 
function will halt further processing of the request and return a response with a 401 Unauthorized 
HTTP status code. This indicates to the client that the request failed because it lacked valid authentication credentials.
The generic message returned in the response body is intentionally vague, because returning a more specific message, 
such as "Username not found" or "Incorrect password" would inadvertently help anyone attempting to hack a user account.*/
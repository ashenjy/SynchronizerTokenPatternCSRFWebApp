//npm modules
const express = require('express');
const uuid = require('uuid/v4')
const session = require('express-session')
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var path = require('path');

const PORT = process.env.PORT || 3000;
// create the server
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

// add & configure middleware
app.use(session({
    genid: (req) => {
        console.log('Inside the session middleware')
        console.log(req.sessionID)
        return uuid() // use UUIDs for session IDs
    },
    secret: 'sdadsadsadsakfijafdoahdahf',
    resave: false,
    saveUninitialized: true
}))

// This middleware adds a req.csrfToken() function 
// to make a token which should be added to requests which mutate state, 
// within a hidden form field, query-string etc.
//  This token is validated against the visitor's session or csrf cookie.
app.use(csrf())

// error handler
app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
  
    // handle CSRF token errors here
    res.status(403)
    res.send('form tampered with')
  })


// create the homepage route at '/'
app.get('/', (req, res) => {
    console.log('Inside the homepage callback function')
    console.log(req.sessionID)
    console.log(req.csrfToken())
    res.render('send', { csrfToken: req.csrfToken() })
})

app.get('/login', function (req, res) {
    
    res.sendFile(path.join(__dirname + '/index.html'));
})

// In the website, implement an endpoint that accepts 
// HTTP POST requests and respond with the CSRF token.
// The endpoint receives the session cookie and based on the session identifier,
// return the CSRF token value.
app.post('/process', function (req, res) {
    res.send('data is being processed')
})


// tell the server what port to listen on
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})
//Contributors: Osbaldo Martinez
//This files contains the server's configurations
//The libraries used for the server set up
const express = require('express');
const http = require('http');
const https = require('https');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require("express-session");
const flash = require('connect-flash');
const fs = require('fs');

//*
//get the key and certificate information for the https server to use.
const privateKey  = fs.readFileSync('sslcert/HSSL-5fabb13cdfde3.key', 'utf8');
const certificate = fs.readFileSync('sslcert/list_tsfcomics_com.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};
//*/

const app = express();

app.use(express.static("public"));

app.use(session({
    secret: "cats",
    resave: true,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(passport.initialize());
app.use(passport.session());
require('./config/userPassport')(passport);
require('./config/administratorPassport')(passport);

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
    app.locals.loggedIn = req.user;
    app.locals.success = req.flash('success');
    app.locals.error = req.flash('error');
    app.locals.redirectUrl
    next();
});

// Handlebars
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    
}));
app.set('view engine', 'hbs');

// Routes
app.use('/', require('./routes/index'));
app.use('/moderators', require('./routes/moderator'));
app.use('/masteradmin', require('./routes/masterAdmin'));
app.use('/search', require('./routes/search'));
app.use('/libraryitem', require('./routes/libraryItem'));
app.use('/submit', require('./routes/submitItem'));
app.use('/banner', require('./routes/banner'));
app.use('/favicon', require('./routes/favicon'));
app.use('/tag', require('./routes/tag'));
app.use('/error', require('./routes/error'));

// Error-handling middleware
app.use(function(req, res, next) {
    res.status(404);
    res.redirect('/error');    
});

/* Start server
// Set port number
app.set('port', 3000);

const server = http.Server(app);

server.listen(app.get('port'), function () {
    console.log('Starting server on port ' + app.get('port'));
});
//*/

//*
const httpsServer = https.createServer(credentials, app);
//use port 8080 for the https server
httpsServer.listen(8080, function () {
    console.log('Starting server on port 8080');
});
//*/
// Limit max concurrent connections to n (non-functional requirement)
//let n = 1000;
//server.maxConnections = n;

module.exports = app;

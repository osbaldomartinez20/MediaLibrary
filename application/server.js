const express = require('express');
const http = require('http');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require("express-session");
const flash = require('connect-flash');

const app = express();
const server = http.Server(app);

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

// Error-handling middleware
app.use(function(req, res, next) {
    res.status(404);
    res.render('error');    
});

// Set port number
app.set('port', 3000);

// Start server
server.listen(app.get('port'), function () {
    console.log('Starting server on port ' + app.get('port'));
});

// Limit max concurrent connections to 50 (non-functional requirement)
server.maxConnections = 50;

module.exports = app;
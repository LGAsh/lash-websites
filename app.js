
const db = require('./db');
const express = require('express');
const flash = require('connect-flash');
const app = express();
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

require('./config/passport')(passport);




const sessionOptions = {
	secret: 'facts my guy',
	resave: false,
	saveUninitialized: false,
};




app.use(session(sessionOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
// serve static files
app.use(express.static( 'public'));
//app.use('/', routes);

require('./routes')(app, passport);





app.listen(process.env.PORT || 3000);
console.log('you already');

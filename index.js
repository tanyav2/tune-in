var express = require('express');
var cookieParser = require('cookie-parser');

// userController takes care of rendering the view and
// routing requests to the server
var authController = require('./controllers/authController');
var userController = require('./controllers/userController');

var app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'))
   .use(cookieParser());

authController(app);

app.listen(process.env.PORT || 4000);
console.log("Listening to port 4000...");

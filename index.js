var express = require('express');
var socket = require('socket.io');
var cookieParser = require('cookie-parser');
var count = 0;

// userController takes care of rendering the view and
// routing requests to the server
var authController = require('./controllers/authController');
var userController = require('./controllers/userController');

var app = express();


app.set('view engine', 'ejs');
app.use(express.static('./public'))
   .use(cookieParser());

var server = app.listen(process.env.PORT || 4000);
console.log("Listening to port 4000...");
var io = socket(server);
io.on('connection', function(socket){
  count++;
  //console.log('Made socket connection', socket.handshake.query);
  socket.broadcast.emit('users', socket.handshake.query);
  console.log("IMCOUNT", count);
});

authController(app);

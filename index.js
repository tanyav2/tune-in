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


io.of('/tune-in').on('connection', function(socket){
  count++;
  //console.log('Made socket connection', socket.handshake.query);
  socket.broadcast.emit('users', socket.handshake.query);
  console.log("number of connected clients", count);

  socket.on('friend', function(data){
    // Get my playback
    console.log("me xxxyy: ", data.me);

    // Set friend's playback to my playback
    console.log("friend xxxyy: ", data.friend);

    userController(app, data.me, data.friend);
  });
});

authController(app);

var express = require('express');
var todoController = require('./controllers/todoController');
// var Spotify = require('spotify-web-api-js');
// var refresh = require('spotify-refresh');

// var spotify = new Spotify();
var app = express();

// var spotifyApi = new SpotifyWebApi();

// spotifyApi.setAccessToken('BQCKd2GEq75TFtqrjw0KQHhxh4AJjK7bpOgww9xVJueC506CJM3IjmPosZOIoCowK2m8z4-GXaB-028E68U7ioTrocPh0RHobb3IYSZTscc5JWrBioVF2K7FAKj03EGMKyaZqboC4fp8n60KZm0iambN-e-7knEKUHVoUkMXd4OVCguMpeP4vDs');

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

todoController(app);

app.listen(process.env.PORT || 3000);
console.log("Listening to port 3000...");

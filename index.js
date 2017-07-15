var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));


app.get('/', function(req, res){
  res.render('index');
});

app.get('/success', function(req, res){
  res.send('sorry no one found');
});

app.listen(process.env.PORT || 3000);
console.log("Listening to port 5000...");

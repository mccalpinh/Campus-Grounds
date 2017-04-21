var express = require('express');
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
var path = require('path');
var modelTools = require('./models/dataTools.js');

// Create the express object and pass it to the http server
var app = express();
var http = require('http').Server(app);

// Set assets as a directory where pictures and such will be available
app.use(express.static(path.join(__dirname,'assets')));

// urlencoded() extracs data from POST requests and
// add this data as a body element in the request object
app.use(bodyParser.urlencoded({extended: true}));

// Set the view engine of the express app to ejs
app.set('view engine', 'ejs');

// Respond to GET request for target '/about'
app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/html/about.html');
});

// Respond to GET request for target '/team'
var members;
app.get('/team', (req, res) => {
  modelTools.readJsonFile('./models/data.json', (text) => {
    members = text;
    res.render('team.ejs', {data: members.participants});
  });

});


// Respond to GET request for target '/'
app.get('/', function(req, res){
  // obtain data from movies into cursor object
  var cursor = db.collection('movies').find();
  // console.log(cursor);  // This has too much info
  // convert to an array to extract the movie data
  cursor.toArray(function (err, results) {
    if (err)
    return console.log(err);

    // Render index.ejs
    res.render('index.ejs', {movies: results});
  });

  console.log('got GET / request');

});

// Respond to POST request for target '/addmovie'
app.post('/addmovie', (req, res) => {
  console.log('got Post /addmovie request');
  console.log(req.body);
  db.collection('movies').save(req.body, (err, result) => {
    if (err)
    return console.log(err);
    console.log('saved to database');
    updateIds();  // update the list of movie IDs since a movie was added
    res.redirect('/');
  });
});

// Respond to POST request for target '/update'
app.post('/update', (req, res) => {
  console.log('got Post /update request');
  console.log(req.body);
  db.collection('movies').update(
    {_id: ids[req.body.num]}, // _id of element to be updated
    {$set: {title: req.body.title, rating: req.body.rating}}
    , (result) => {
      res.redirect('/');  // update the page
    });
});

var port = process.env.PORT || 3000;

// db will be associated with the database when the connection to
// to MongoLab is established.
var db;
// The ids of current entries in the database are keep in array ids.
var ids = new Array();

// Connect to MongoLab, when the connection is established then
// associate the MongoLab database with variable db and start listening
// to HTML requests.
MongoClient.connect('mongodb://pauca:wfu1soccer@ds011912.mlab.com:11912/rottenpotatos',
(err, database) => {
  if (err)
  return console.log(err);

  db = database;
  updateIds((result)=>{
    console.log(result);
  });

  http.listen( port, function () {
    console.log('Listening on localhost ' + port);
  });
});

function updateIds(callback) {
  var cursor = db.collection('movies').find();
  cursor.toArray(function (err, results) {
    if (err)
    return console.log(err);

    for (var i = 0; i < results.length; i++) {
      ids.push(results[i]._id);
    }
    callback(ids);
  });
}
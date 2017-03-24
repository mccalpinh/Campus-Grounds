//loading necessary modules (express, http)
var express = require('express'); //define variable express, import express package
var httpModule = require('http');
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient

var productTable = "products";

//create an express app, express is a function
var app = express();
//express will be the server for http object created
var http = httpModule.Server(app);
//Tells app that any assets (images, logos, etc.) will be found in a folder called assets

 app.use(express.static('assets'));

 // urlencoded() extracs data from POST requests and
 // add this data as a body element in the request object
 app.use(bodyParser.urlencoded({extended: true}));

 // Set the view engine of the express app to ejs
 app.set('view engine', 'ejs');

 app.get('/about', (req, res)=>{
   res.sendFile(__dirname + '/about.html');
 });

  app.get('/login', (req, res)=>{
   res.sendFile(__dirname + '/login.html');
 });

   app.get('/welcome', (req, res)=>{
   res.sendFile(__dirname + '/welcome.html');
 });

//result - render manageInv.ejs
  app.get('/manageInv', (req, res)=>{
    // obtain data from movies into cursor object
  var cursor = db.collection(productTable).find();
  // console.log(cursor);  // This has too much info
  // convert to an array to extract the movie data
  cursor.toArray(function (err, results) {
    if (err)
      return console.log(err);

    // Render index.ejs
    res.render('manageInv.ejs', {inventory: results});
    console.log(results)
  });

});

 app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
   console.log('got a GET request');
 });

app.post('/addInv', (req, res) => {
  console.log("got POST request");
  console.log(req.body);
  db.collection(productTable).save(req.body, (err, result) => {
    if (err)
      return console.log(err);
    console.log('saved to database');
    res.redirect('/manageInv');
  });
});

 // Load the module
 var modelTools = require('./models/dataTools.js');



 // Respond to GET request for target '/team'
 var members;
 app.get('/team', (req, res) => {
   modelTools.readJsonFile('./models/data.json', (text) => {
     members = text;
     // data is specified in the team.ejs file and replaced with
     // members.participants
     res.render('team.ejs', {data: members.participants});
   });
 });

 app.post('/people', (req, res) => {

 });


  var db;

  var port = process.env.PORT || 3000; // || = or
  MongoClient.connect('mongodb://cguser:coffee1834@ds113680.mlab.com:13680/campusgrounds',
(err, database) => {
  if (err)
  return console.log(err);

  db = database;

  http.listen( port, function () {
    console.log('Listening on localhost ' + port);
  });
});

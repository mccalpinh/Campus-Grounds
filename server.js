//loading necessary modules (express, http)
var express = require('express'); //define variable express, import express package
var httpModule = require('http');
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient

var productTable = "products";
var vendorTable = "Vendors";

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
  var c2 = db.collection(vendorTable).find();
  // console.log(cursor);  // This has too much info
  // convert to an array to extract the movie data
  updateIds();
  cursor.toArray(function (err, results) {
    if (err)
      return console.log(err);


    c2.toArray(function (err, c2results) {
      if (err)
        return console.log(err);

      // Render index.ejs
      res.render('manageInv.ejs', {vendor: c2results, inventory: results});
      console.log(results);

    });

  });

});
//result - render manageInv.ejs


app.get('/manageVen', (req, res)=>{
    // obtain data from movies into cursor object
  var cursor = db.collection(vendorTable).find();
  // console.log(cursor);  // This has too much info
  // convert to an array to extract the movie data
  cursor.toArray(function (err, results) {
    if (err)
      return console.log(err);

    // Render index.ejs
    res.render('manageVen.ejs', {vendor: results});
    console.log(results)
  });
});

 app.get('/', (req, res) => {
   res.sendFile(__dirname + '/login.html');
   console.log('got a GET request');
 });


app.post('/updateordelete', (req, res) => {
  console.log(req.body);
  console.log(ids[req.body.num]);
  if(req.body.operationType == "update"){
  db.collection(productTable).update(
    {_id: ids[req.body.num]}, // _id of element to be updated
    {$set: {productName: req.body.productName, quantity: req.body.quantity, flavor: req.body.flavor, vendor: req.body.vendor, purchaseunit: req.body.purchaseunit, inventoryunit1: req.body.inventoryunit1, inventoryunit2: req.body.inventoryunit2}}
    , (result) => {
    //  res.redirect('/manageInv');  // update the page
    });
  }
  else if(req.body.operationType== "delete"){
    console.log("deleting something");
    db.collection(productTable).remove(
      {_id: ids[req.body.num]}, true, (error, result) => {
        if (error !== null) {
          console.log('[ERR] Failed to find item in num ' + req.body.num
            + ' array of ids are:  ' + JSON.stringify(ids));
        } else {
          updateIds();
          res.redirect('/manageInv');  // update the page
        }
      });
  }
});

app.post('/addInv', (req, res) => {
  console.log("got POST request");
  console.log(req.body);
  db.collection(productTable).save(req.body, (err, result) => {
    if (err)
      return console.log(err);
    console.log('saved to database');
    updateIds();
    res.redirect('/manageInv');
  });
});

app.post('/addVen', (req, res) => {
  console.log("got POST request");
  console.log(req.body);
  db.collection(vendorTable).save(req.body, (err, result) => {
    if (err)
      return console.log(err);
    console.log('saved to database');
    res.redirect('/manageVen');
  });
});

app.post('/deleteVen', (req, res) => {
  console.log(req.body);
  console.log(ids[req.body.num]);
  console.log("deleting something");
  db.collection(vendorTable).remove(
    {_id: ids[req.body.num]}, true, (error, result) => {
      if (error !== null) {
        console.log('[ERR] Failed to find item in num ' + req.body.num
          + ' array of ids are:  ' + JSON.stringify(ids));
      } else {
        updateIdsVen();
        res.redirect('/manageVen');  // update the page
      }
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
  // The ids of current entries in the database are keep in array ids.
  var ids = new Array();

  var port = process.env.PORT || 3000; // || = or
MongoClient.connect('mongodb://cguser:coffee1834@ds113680.mlab.com:13680/campusgrounds',
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
  var cursor = db.collection(productTable).find();
  cursor.toArray(function (err, results) {
    if (err)
    return console.log(err);
    ids = [];
    for (var i = 0; i < results.length; i++) {
      ids.push(results[i]._id);
    }
    if (typeof callback != 'undefined')
      callback(ids);
  });
}

function updateIdsVen(callback) {
  var cursor = db.collection(vendorTable).find();
  cursor.toArray(function (err, results) {
    if (err)
    return console.log(err);
    ids = [];
    for (var i = 0; i < results.length; i++) {
      ids.push(results[i]._id);
    }
    if (typeof callback != 'undefined')
      callback(ids);
  });
}

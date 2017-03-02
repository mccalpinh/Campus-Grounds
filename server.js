//loading necessary modules (express, http)
var express = require('express'); //define variable express, import express package
var httpModule = require('http');
//create an express app, express is a function
var app = express();
//express will be the server for http object created
var http = httpModule.Server(app);
//Tells app that any assets (images, logos, etc.) will be found in a folder called assets
 app.use(express.static('assets'));

 app.get('/about', (req, res)=>{
   res.sendFile(__dirname + '/about.html');
 });
 
  app.get('/login', (req, res)=>{
   res.sendFile(__dirname + '/login.html');
 });
 
   app.get('/welcome', (req, res)=>{
   res.sendFile(__dirname + '/welcome.html');
 });

 app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
   console.log('got a GET request');
 });


 function portlistener(){
   console.log('Listening in on localhost' + port);
 }
 var port = process.env.PORT || 3000; // || = or
 http.listen(port, portlistener);

 // Load the module
 var modelTools = require('./models/dataTools.js');

 // Set the view engine of the express app to ejs
 app.set('view engine', 'ejs');

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
   
 })

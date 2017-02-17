//loading necessary modules (express, http)
var express = require('express'); //define variable express, import express package
var httpModule = require('http');
//create an express app, express is a function
var app = express();
//express will be the server for http object created
var http = httpModule.Server(app);
//Tells app that any assets (images, logos, etc.) will be found in a folder called assets
 app.use(express.static('assets'));


 function responder(req, res){
   //sending a file to the user's browswer
   res.sendFile(__dirname + '/index.html');          //response is to send a file, dirname already exists when code is running, add file we want to send to computer
   //print message in the server side console
   console.log('got a request');
 }

//Get request to / is given to responder function
//whatever the website name, nothing else, just / as entry point
 app.get('/', responder);

 function portlistener(){
   console.log('Listening in on localhost' + port);
 }
 var port = process.env.PORT || 3000; // || = or
 http.listen(port, portlistener);

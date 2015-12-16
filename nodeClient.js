/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var http = require('http');

// Options to be used by request 
var options = {
   host: '192.168.1.4',
   port: '8081',
   path: '/index.html'  
};

// Callback function is used to deal with response
var callback = function(response){
   // Continuously update stream with data
   var body = '';
   response.on('data', function(data) {
      body += data;
   });
   
   response.on('end', function() {
      // Data received completely.
      console.log(body);
   });
};
// Make a request to the server
var req = http.request(options, callback);
req.end();
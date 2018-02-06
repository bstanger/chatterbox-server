/* Import node's http module: */
var http = require('http');
// var handleRequest = require('./request-handler.js');
var express = require('express');
var app = express();
// handleRequest = handleRequest.requestHandler;


// Every server needs to listen on a port with a unique number. The
// standard port for HTTP servers is port 80, but that port is
// normally already claimed by another server and/or not accessible
// so we'll use a standard testing port like 3000, other common development
// ports are 8080 and 1337.
var port = 3000;

// For now, since you're running this server on your local machine,
// we'll have it listen on the IP address 127.0.0.1, which is a
// special address that always refers to localhost.
var ip = '127.0.0.1';

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'Origin, X-Requested-With, content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var date = new Date();
var result = {
  createdAt: date.toJSON(),
  objectId: 'Tgu8AV4azL',
  roomname: 'lobby',
  message: 'test text',
  username: 'test username'
};
var data = {
  results: [result]
};

var objectIdCounter = 0;

app.get('/classes/messages', function(req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  //var responseBody = JSON.stringify(data);
  res.set(defaultCorsHeaders);
  res.status(200);
  res.send(data);
});

app.post('/classes/messages', function(req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.set(defaultCorsHeaders);
  var entry = Object.assign({}, req.query);
  req.status(201);

  var date = new Date();
  entry.createdAt = date.toJSON();
  entry.objectId = objectIdCounter++;
  data.results.push(entry);    

  var responseBody = {
    status: 200,
    success: 'Updated Successfully',
    createdAt: entry.createdAt,
    objectId: entry.objectId
  };
  res.send(responseBody);
});

// We use node's http module to create a server.
//
// The function we pass to http.createServer will be used to handle all
// incoming requests.
//

// After creating the server, we will tell it to listen on the given port and IP. */
// var server = http.createServer(app);
console.log('Listening on http://' + ip + ':' + port);
app.listen(port, ip);

// To start this server, run:
//
//   node basic-server.js
//
// on the command line.
//
// To connect to the server, load http://127.0.0.1:3000 in your web
// browser.
//
// server.listen() will continue running as long as there is the
// possibility of serving more requests. To stop your server, hit
// Ctrl-C on the command line.


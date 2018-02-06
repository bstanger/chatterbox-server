/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'Origin, X-Requested-With, content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

//const qs = require('querystring');
var objectIdCounter = 0;

//example data
var date = new Date();
var result = {
  createdAt: date.toJSON(),
  objectId: 'Tgu8AV4azL',
  roomname: 'lobby',
  message: 'test text',
  username: 'test username'
};
var data = {
  results: []
};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var headers = defaultCorsHeaders;
  var statusCode = 200;
  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';
  
  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  if (request.url.slice(0, 17) !== '/classes/messages') {
    var statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
    return;
  }
  // See the note below about CORS headers.
  if (request.method === 'GET') {
    var responseBody = JSON.stringify(data);
    response.end(responseBody);
  } else if (request.method === 'POST') {
    statusCode = 201;
    var body = '';
    // debugger;
    request.on('data', function (data) {
      body += data;

      // Too much POST data, kill the connection!
      if (body.length > 1e6) {
        request.connection.destroy();
        statusCode = 413;
      }
    });

    request.on('end', function () {
      try {
        var post = JSON.parse(body);
        var date = new Date();
        post.createdAt = date.toJSON();
        post.objectId = objectIdCounter++;
        data.results.push(post);    
        var responseBody = JSON.stringify({
          status: 200,
          success: 'Updated Successfully',
          createdAt: post.createdAt,
          objectId: post.objectId
        });
      } catch (error) {
        responseBody = error.toString();
        statusCode = 400; 
      }
      response.writeHead(statusCode, headers);
      response.end(responseBody);
    });
  } else {
    response.end();
  }

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};

exports.requestHandler = requestHandler;


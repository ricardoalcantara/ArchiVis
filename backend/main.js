var express = require("express");
var bodyParser = require("body-parser");

var server = express();
var port = process.env.port || 8888;

var jsonParser = bodyParser.json();

server.use('/', function (req, res, next) {
	console.log('Request Url:' + req.url);
	next();
});

server.post('/example1', jsonParser, function(req, res){
                       
});

server.get('/example2', jsonParser, function(req, res){
                        
});

server.listen(port);

console.log("Listening on port " + port + "...");
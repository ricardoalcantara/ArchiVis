var express = require("express");
var bodyParser = require("body-parser");

var analysisManager = require("./archivis.core/analysisManager.js");

var server = express();
var port = process.env.port || 8888;

var jsonParser = bodyParser.json();

server.use('/', function (req, res, next) {
	console.log('Request Url:' + req.url);
	next();
});

server.post('/analysebusinessdep/:elementname/:hoops', jsonParser, function(req, res){
		
    var elementName = req.params.elementname;
	var hoops = req.params.hoops;
	
	analysisManager.analyseBusinessDependency("ApplicationComponent", hoops, elementName, function (response){    		
		res.json(response);    
	});    
	                       
});

server.post('/analyseapplicationdep/:elementname/:hoops', jsonParser, function(req, res){
		
    var elementName = req.params.elementname;
	var hoops = req.params.hoops;
	
	analysisManager.analyseApplicationDependency("ApplicationComponent", hoops, elementName, function (response){    		
		res.json(response);    
	});    
	                       
});

server.post('/analysetechnologydep/:elementname/:hoops', jsonParser, function(req, res){
		
    var elementName = req.params.elementname;
	var hoops = req.params.hoops;
	
	analysisManager.analyseTechnologyDependency("ApplicationComponent", hoops, elementName, function (response){    		
		res.json(response);    
	});    
	                       
});

server.post('/analysedatausage/:elementname/:hoops', jsonParser, function(req, res){
		
    var elementName = req.params.elementname;
	var hoops = req.params.hoops;
	
	analysisManager.analyseDataUsage("ApplicationComponent", hoops, elementName, function (response){    		
		res.json(response);    
	});    
	                       
});

server.get('/example2', jsonParser, function(req, res){
                        
});

server.listen(port);

console.log("Listening on port " + port + "...");
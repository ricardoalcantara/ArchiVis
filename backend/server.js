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

server.post('/analysebusinessdepbp/:elementname/:hoops', jsonParser, function(req, res){
		
    var elementName = req.params.elementname;
	var hoops = req.params.hoops;
	
	analysisManager.analyseBusinessDependencyWithBusinessProcess("ApplicationComponent", hoops, elementName, function (response){    		
		res.json(response);    
	});    
	                       
});

server.post('/analysebusinessdepba/:elementname/:hoops', jsonParser, function(req, res){
		
    var elementName = req.params.elementname;
	var hoops = req.params.hoops;
	
	analysisManager.analyseBusinessDependencyWithBusinessActor("ApplicationComponent", hoops, elementName, function (response){    		
		res.json(response);    
	});    
	                       
});

server.post('/analyseapplicationbdep/:elementname/:hoops', jsonParser, function(req, res){
		
    var elementName = req.params.elementname;
	var hoops = req.params.hoops;
	
	analysisManager.analyseApplicationBidirecionalDependency("ApplicationComponent", hoops, elementName, function (response){    		
		res.json(response);    
	});    
	                       
});

server.post('/analyseapplicationrdep/:elementname/:hoops', jsonParser, function(req, res){
		
    var elementName = req.params.elementname;
	var hoops = req.params.hoops;
	
	analysisManager.analyseApplicationRightDependency("ApplicationComponent", hoops, elementName, function (response){    		
		res.json(response);    
	});    
	                       
});

server.post('/analyseapplicationldep/:elementname/:hoops', jsonParser, function(req, res){
		
    var elementName = req.params.elementname;
	var hoops = req.params.hoops;
	
	analysisManager.analyseApplicationLeftDependency("ApplicationComponent", hoops, elementName, function (response){    		
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

server.post('/analysedatalusage/:elementname/:hoops', jsonParser, function(req, res){
		
    var elementName = req.params.elementname;
	var hoops = req.params.hoops;
	
	analysisManager.analyseDataLeftUsage("ApplicationComponent", hoops, elementName, function (response){    		
		res.json(response);    
	});    
	                       
});

server.post('/analysedatabusage/:elementname/:hoops', jsonParser, function(req, res){
		
    var elementName = req.params.elementname;
	var hoops = req.params.hoops;
	
	analysisManager.analyseDataBidirecionalUsage("ApplicationComponent", hoops, elementName, function (response){    		
		res.json(response);    
	});    
	                       
});

server.get('/example2', jsonParser, function(req, res){
                        
});

server.listen(port);

console.log("Listening on port " + port + "...");
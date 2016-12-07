const graphManager = require("./graphManager.js");
const path = require('path');

var fs = require("fs"),
    xml2js = require("xml2js");

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};  

function recordRelationships(parsedFile) {
    var currentRelationship;
    
    for(var i = 0, len = parsedFile["model"]["relationships"][0]["relationship"].length; i < len; i++){
        try{
            currentRelationship = parsedFile["model"]["relationships"][0]["relationship"][i];
            
            graphManager.recordRelationship(
                currentRelationship["$"]["source"],
                currentRelationship["$"]["target"],
                currentRelationship["$"]["xsi:type"]);      
        }catch(err){
            console.log("FAILED ON INSERT RELATIONSHIP");    
        }             
    }    
}

// Simulates a serial processing
function nodeIterator(i, length, parsedFile, recordRelationshipsCallback) {
    if(i < length) {   
        try{
            var currentNode = parsedFile["model"]["elements"][0]["element"][i];
            
            graphManager.recordNode(
                currentNode["$"]["identifier"],
                currentNode["label"][0]["_"],
                currentNode["$"]["xsi:type"],
                function (){
                    nodeIterator(i + 1, length, parsedFile, recordRelationshipsCallback);   

                    if(i == length - 1){ // If is the last inserted node, then start the relationships register
                        recordRelationshipsCallback(parsedFile);    
                    }                    
                });     
        }catch(err){
            console.log("FAILED ON INSERT NODE");
            nodeIterator(i + 1, length, parsedFile, recordRelationshipsCallback);       
        }                     
    }    
} 

module.exports = {
    archimateOpenExchange2graph : function (fileName) {
        var parser = new xml2js.Parser({explicitArray : true});
        var filePath = path.join(__dirname, "data", fileName);

        fs.readFile(filePath, function(err, data) {        
                parser.parseString(data, function (err, result) {
                    if(result != null){
                        graphManager.clearModel(function (){
                            nodeIterator(0, result["model"]["elements"][0]["element"].length, result, recordRelationships);    
                        });
                    }else{
                        console.log("ERR: Problem on parsing the input file"); 
                    }                                   
                });   
        });          
    }
}      
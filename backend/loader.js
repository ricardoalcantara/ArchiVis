var graphManager = require("./graphManager.js");

var fs = require("fs"),
    xml2js = require("xml2js");

module.exports = {
    archimateOpenExchange2graph : function (fileName) {
        var parser = new xml2js.Parser({explicitArray : true});
        fs.readFile(__dirname + "/" + fileName, function(err, data) {
            parser.parseString(data, function (err, result) {
                nodeIterator(0, result["model"]["elements"][0]["element"].length, result, recordRelationships);
            });
        });

        function recordRelationships(parsedFile) {
            for(var i = 0, len = parsedFile["model"]["relationships"][0]["relationship"].length; i < len; i++){
                try{
                    graphManager.recordRelationship(
                        parsedFile["model"]["relationships"][0]["relationship"][i]["$"]["source"],
                        parsedFile["model"]["relationships"][0]["relationship"][i]["$"]["target"],
                        parsedFile["model"]["relationships"][0]["relationship"][i]["$"]["xsi:type"]);      
                }catch(err){
                    console.log("FAILED ON INSERT RELATIONSHIP");    
                }             
            }    
        }

        // Simulates a serial processing
        function nodeIterator(i, length, parsedFile, recordRelationshipsCallback) {
            if(i < length) {   
                try{
                    graphManager.recordNode(
                        parsedFile["model"]["elements"][0]["element"][i]["$"]["identifier"],
                        parsedFile["model"]["elements"][0]["element"][i]["label"][0]["_"],
                        parsedFile["model"]["elements"][0]["element"][i]["$"]["xsi:type"],
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
    }
}        
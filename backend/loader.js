var graphManager = require("./graphManager.js");

var fs = require("fs"),
    xml2js = require("xml2js"),
    Log = require("log"),
    log = new Log("info");

module.exports = {
    archimateOpenExchange2graph : function (fileName, isUpdate) {
        var parser = new xml2js.Parser({explicitArray : true});
        fs.readFile(__dirname + "/" + fileName, function(err, data) {
            parser.parseString(data, function (err, result) {
                graphManager.getTimePoint(isUpdate, function(timePoint){
                    nodeIterator(0, result["model"]["elements"][0]["element"].length, result, timePoint, recordRelationships);    
                });        
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
                    log.error("FAILED ON INSERT RELATIONSHIP: "+
                        parsedFile["model"]["relationships"][0]["relationship"][i]["$"]["source"]+","+
                        parsedFile["model"]["relationships"][0]["relationship"][i]["$"]["target"]+","+
                        parsedFile["model"]["relationships"][0]["relationship"][i]["$"]["xsi:type"]);    
                }             
            }    
        }

        // Simulates a serial processing
        function nodeIterator(i, length, parsedFile, timePoint, recordRelationshipsCallback) {
            if(i < length) {   
                try{
                    graphManager.recordNode(
                        parsedFile["model"]["elements"][0]["element"][i]["$"]["identifier"],
                        parsedFile["model"]["elements"][0]["element"][i]["label"][0]["_"],
                        parsedFile["model"]["elements"][0]["element"][i]["$"]["xsi:type"],
                        timePoint,
                        function (){
                            nodeIterator(i + 1, length, parsedFile, timePoint, recordRelationshipsCallback);   

                            if(i == length - 1){ // If is the last inserted node, then start the relationships register
                                recordRelationshipsCallback(parsedFile);    
                            }                    
                        });     
                }catch(err){
                    log.error("FAILED ON INSERT NODE: "+
                        parsedFile["model"]["relationships"][0]["relationship"][i]["$"]["source"]+","+
                        parsedFile["model"]["relationships"][0]["relationship"][i]["$"]["target"]+","+
                        parsedFile["model"]["relationships"][0]["relationship"][i]["$"]["xsi:type"]);   
   
                    nodeIterator(i + 1, length, parsedFile, timePoint, recordRelationshipsCallback);       
                }                     
            }    
        }    
    },
    
    correctModel : function (fileName) {   
        fs.readFile(__dirname + "/" + fileName, "utf8", function(err, data) {
            if (err) console.log(err);
            
            data = data.replaceAll("ArchimateModel", "model");
            data = data.replaceAll("folders", "folder");
            data = data.replaceAll("elements", "element");
            data = data.replaceAll("children", "child");
            data = data.replaceAll("sourceConnections", "sourceConnection");
            data = data.replaceAll("DiagramModelArchimateObject", "DiagramObject");
            data = data.replaceAll("DiagramModelArchimateConnection", "Connection");
            data = data.replaceAll("DiagramModelGroup", "Group");
            data = data.replaceAll("DiagramModelNote", "Note");
            data = data.replaceAll("bendpoints", "bendpoint");
            
            fs.writeFile(__dirname + "/result.xml", data, "utf8", function(err, writedData){
                if (err) console.log(err);
            });    
        });    
    }
}      

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};  
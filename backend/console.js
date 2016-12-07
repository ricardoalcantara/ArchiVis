var loader = require("./archivis.importer/loader.js");
var analysisManager = require("./archivis.core/analysisManager.js");
var processor = require("./archivis.core/modelProcessor.js");

var program = require('commander');

function printNodeData (result) {
    for(var i = 0, len = result.length; i < len; i++){
        console.log(result[i].name + " (" + result[i].id + ") [" + result[i].type + "]");
    }    
}

program
  .version('0.0.1')

program
  .command('load [fileName]')
  .alias('ld')
  .description('Load an Archimate Model File')
  .action(function(fileName){
    loader.archimateOpenExchange2graph(fileName);  
  });
  
program
  .command('util')
  .alias('ut')
  .option('-d, --derivate', 'Generates derivated relationships')
  .description('Applies some administrative processing to the graph')
  .action(function(options){
    processor.generateDerivatedRelationships(1);
  });

program
  .command('status')
  .alias('st')
  .description('Verifies the healthy of an imported Archimate Model')
  .option('-i, --isolated', 'Return all nodes without any relationships')
  .option('-b, --behaviour', 'Return all behaviour elements without an actor associated')
  .option('-d, --duplicated', 'Return all elements that have duplicate elements')
  .action(function(options){
    if(options.isolated)
        analysisManager.findIsolatedNodes();
        
    if(options.behaviour)
        analysisManager.findBehaviourAntiPattern();
        
    if(options.duplicated)
        analysisManager.findSimilarNodes();
  });
  
program
  .command('analyseApp [hoops] [elementName]')
  .alias('aa')
  .description('Performs model analysis')
  .option('-g, --general', 'Reports all aspects related with an application')
  .option('-b, --bussiness', 'Reports the business aspects related with an application')
  .option('-a, --application', 'Reports the application aspects related with an application')
  .option('-t, --techonology', 'Reports the techonology aspects related with an application')
  .option('-d, --data', 'Reports the data aspects related with an application') 
  .option('-c, --depedency', 'Reports the depedency degree of an application')
  .action(function(hoops, elementName, options){
    if(options.general){
        analysisManager.analyseBusinessDependency("ApplicationComponent", hoops, elementName, printNodeData);
        analysisManager.analyseApplicationDependency("ApplicationComponent", hoops, elementName, printNodeData);
        analysisManager.analyseTechnologyDependency("ApplicationComponent", hoops, elementName, printNodeData);
        analysisManager.analyseDataUsage("ApplicationComponent", hoops, elementName, printNodeData);    
    }        
        
    if(options.bussiness)
        analysisManager.analyseBusinessDependency("ApplicationComponent", hoops, elementName, printNodeData);
        
    if(options.application)
        analysisManager.analyseApplicationDependency("ApplicationComponent", hoops, elementName, printNodeData);
        
    if(options.techonology)
        analysisManager.analyseTechnologyDependency("ApplicationComponent", hoops, elementName, printNodeData);
        
    if(options.data)
        analysisManager.analyseDataUsage("ApplicationComponent", hoops, elementName, printNodeData);
            
    if(options.depedency){
        analysisManager.analyseApplicationDependencyProducerLevel(hoops, elementName);
        analysisManager.analyseApplicationDependencyConsumerLevel(hoops, elementName);
    }
  });

program.parse(process.argv);
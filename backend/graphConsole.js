var loader = require("./loader.js");
var queryManager = require("./queryManager.js");


var program = require('commander');

program
  .version('0.0.1')

program
  .command('load [fileName]')
  .alias('ld')
  .description('Load an Archimate Model File')
  .action(function(fileName){
    loader.archimateOpenExchange2graph(fileName, true);  
  });
  
program
  .command('correct [fileName]')
  .alias('cr')
  .description('Corrects a corrupted Archimate Model')
  .action(function(fileName){
    loader.correctModel(fileName);  
  });

program
  .command('status')
  .alias('st')
  .description('Verifies the healthy of an imported Archimate Model')
  .option('-i, --isolated', 'Return all nodes without any relationships')
  .option('-b, --behaviour', 'Return all behaviour elements without an actor associated')
  .action(function(options){
    if(options.isolated)
        queryManager.findIsolatedNodes();
        
    if(options.behaviour)
        queryManager.findBehaviourAntiPattern();
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
        queryManager.analyseBusinessDependency("ApplicationComponent", hoops, elementName);
        queryManager.analyseApplicationDependency("ApplicationComponent", hoops, elementName);
        queryManager.analyseTechnologyDependency("ApplicationComponent", hoops, elementName);
        queryManager.analyseDataUsage("ApplicationComponent", hoops, elementName);    
    }        
        
    if(options.bussiness)
        queryManager.analyseBusinessDependency("ApplicationComponent", hoops, elementName);
        
    if(options.application)
        queryManager.analyseApplicationDependency("ApplicationComponent", hoops, elementName);
        
    if(options.techonology)
        queryManager.analyseTechnologyDependency("ApplicationComponent", hoops, elementName);
        
    if(options.data)
        queryManager.analyseDataUsage("ApplicationComponent", hoops, elementName);
            
    if(options.depedency){
        queryManager.analyseApplicationDependencyProducerLevel(hoops, elementName);
        queryManager.analyseApplicationDependencyConsumerLevel(hoops, elementName);
    }
  });

program.parse(process.argv);
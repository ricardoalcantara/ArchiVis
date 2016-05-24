var loader = require("./loader.js");
var queryManager = require("./queryManager.js");

var args = process.argv.slice(2);

switch (args[0]){
    case "--help":
        console.log("===============================================================");
        console.log("Dataprev Enterprise Model View Console");
        console.log("===============================================================");
        console.log("\nVerificacao de Consistencia");
        console.log("---------------------------------------------------------------");
        console.log("Buscar elementos isolados                       --status --isolated");
        console.log("Buscar comportamento sem atores                 --status --behaviour");
        console.log("\nConsulta de Dependencia");
        console.log("---------------------------------------------------------------");
        console.log("Verificar dependencia de uma aplicacao          --analyse --application [--application | --business | --technology] <Max Hoops> <Element Name>");
        console.log("");
        break; 
    case "--load":     
        loader.archimateOpenExchange2graph(args[1]);
        break;  
    case "--status":
        switch (args[1]){
            case "--isolated":
                queryManager.findIsolatedNodes();
                break; 
            case "--behaviour":
                queryManager.findBehaviourAntiPattern();
                break;
        }            
    case "--analyse": 
        switch (args[1]){
            case "--application":
                switch (args[2]){
                    case "--business":
                        queryManager.analyseBusinessDependency("ApplicationComponent", args[3], args[4]);
                        break;
                    case "--application":
                        queryManager.analyseApplicationDependency("ApplicationComponent", args[3], args[4]);
                        break;
                    case "--technology":
                        queryManager.analyseTechnologyDependency("ApplicationComponent", args[3], args[4]);
                        break;
                    case "--data":
                        queryManager.analyseDataUsage("ApplicationComponent", args[3], args[4]);
                        break;
                    case "--general":
                        queryManager.analyseBusinessDependency("ApplicationComponent", args[3], args[4]);
                        queryManager.analyseApplicationDependency("ApplicationComponent", args[3], args[4]);
                        queryManager.analyseTechnologyDependency("ApplicationComponent", args[3], args[4]);
                        queryManager.analyseDataUsage("ApplicationComponent", args[3], args[4]);
                        break;
                    case "--count":
                        queryManager.analyseApplicationDependencyProducerLevel(args[3], args[4]);
                        queryManager.analyseApplicationDependencyConsumerLevel(args[3], args[4]);
                        break;
                }
                break;    
        }  
        break;
    default:
        console.log("Comando Desconhecido");           
}


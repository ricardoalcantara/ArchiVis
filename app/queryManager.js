var db = require("seraph")( {
    user: 'neo4j',
    pass: 'test'
});

const LEFT = 0;
const BIDIRECTIONAL = 10;
const RIGHT = 20;

function printNodeData (result) {
    for(var i = 0, len = result.length; i < len; i++){
        console.log(result[i].name + " (" + result[i].elementid + ")");
    }    
}

function executeQueries(queries, messages, printListCallback) {
    queriesExecutorRepeter(0, queries.length, queries, messages, printListCallback);         
}

function queriesExecutorRepeter(i, length, queries, messages, printListCallback) {
    if(i < length){
        db.query(queries[i], function(err, result) {
            if (err) console.log(err);
            
            console.log("\n" + messages[i]); // Printing title
            console.log("\n===============================================================\n");
            
            printListCallback(result); // Printing main data of returned nodes
            
            queriesExecutorRepeter(i + 1, length, queries, messages, printListCallback);
        });         
    }
}

function analyseDependency (sourceType, targetType, maxHoops, elementName, direction, printTitleCallback, printListCallback) {
    var query = "MATCH (a:$sourceType)$dir1-[*1..$maxHoops]-$dir2(b:$targetType) WHERE LOWER(a.name) =~ \".*$elementName.*\" RETURN DISTINCT b";
    
    // Replacing mapped query elements
    query = query.replace("$sourceType", sourceType);
    query = query.replace("$targetType", targetType);
    query = query.replace("$maxHoops", maxHoops);
    query = query.replace("$elementName", elementName.toLowerCase());
    
    switch (direction){
        case BIDIRECTIONAL:
            query = query.replace("$dir1", ""); 
            query = query.replace("$dir2", "");
            break; 
        case LEFT:
            query = query.replace("$dir1", "<"); 
            query = query.replace("$dir2", "");
            break;
        case RIGHT:
            query = query.replace("$dir1", ""); 
            query = query.replace("$dir2", ">");
    }        

    // Running query
    db.query(query, function(err, result) {
        if (err) console.log(err);
        
        printTitleCallback();
        printListCallback(result);
    });     
}
    
function countRelated (sourceType, targetType, maxHoops, elementName, direction, printTitleCallback) {
    var query = "MATCH (a:$sourceType)$dir1-[*1..$maxHoops]-$dir2(b:$targetType) WITH count(b) AS depCount, a "+
        "WHERE LOWER(a.name) =~ \".*$elementName.*\" RETURN DISTINCT a, depCount";
    
    // Replacing mapped query elements    
    query = query.replace("$sourceType", sourceType);
    query = query.replace("$targetType", targetType);
    query = query.replace("$maxHoops", maxHoops);
    query = query.replace("$elementName", elementName.toLowerCase());   
    
    switch (direction){
        case BIDIRECTIONAL:
            query = query.replace("$dir1", ""); 
            query = query.replace("$dir2", "");
            break; 
        case LEFT:
            query = query.replace("$dir1", "<"); 
            query = query.replace("$dir2", "");
            break;
        case RIGHT:
            query = query.replace("$dir1", ""); 
            query = query.replace("$dir2", ">");
    } 
    
    // Running query
    db.query(query, function(err, result) {
        if (err) console.log(err);

        printTitleCallback();
        
        // Printing elements data
        for(var i = 0, len = result.length; i < len; i++){
            console.log(result[i].a.name + " (" + result[i].a.elementid + ") - NIVEL DE DEPENDENCIA = " + result[i].depCount);
        }   
    });  
}

module.exports = {
    
    findIsolatedNodes : function () {   
        executeQueries(["MATCH (n) WHERE NOT (n)-[]-() RETURN DISTINCT n"], ["\n> NOS ISOLADOS\n"], printNodeData);  
    }, 
    
    findBehaviourAntiPattern : function () {
        executeQueries(
            [
            "MATCH (a:BusinessProcess)-[:AssignmentRelationship]-(b) WHERE NOT ((a)-[]-(b:BusinessActor) OR (a)-[]-(b:BusinessRole)) RETURN DISTINCT a",
            "MATCH (a:BusinessFunction)-[:AssignmentRelationship]-(b) WHERE NOT ((a)-[]-(b:BusinessActor) OR (a)-[]-(b:BusinessRole)) RETURN DISTINCT a",
            "MATCH (a:ApplicationFunction)-[:AssignmentRelationship]-(b) WHERE NOT (a)-[]-(b:ApplicationComponent) RETURN DISTINCT a",
            "MATCH (a:InfrastructureFunction)-[:AssignmentRelationship]-(b) WHERE NOT ((a)-[]-(b:Node) OR (a)-[]-(b:SystemSoftware)) RETURN DISTINCT a"
            ], 
            [
            "> PROCESSOS DE NEGOCIO SEM ATORES",
            "> FUNCOES DE NEGOCIO SEM ATORES",
            "> FUNCOES DE APLICACAO SEM ATORES",
            "> FUNCOES DE INFRAESTRUTURA SEM ATORES"
            ], printNodeData); 
    }, 
    
    analyseApplicationDependencyProducerLevel : function (maxHoops, elementName) {
        countRelated("ApplicationComponent", "ApplicationComponent", maxHoops, elementName, RIGHT, function () {
            console.log("\n> DEPENDENCIA COMO PRODUTOR\n===============================================================\n");    
        });
    }, 
    
    analyseApplicationDependencyConsumerLevel : function (maxHoops, elementName) {
        countRelated("ApplicationComponent", "ApplicationComponent", maxHoops, elementName, LEFT, function () {
            console.log("\n> DEPENDENCIA COMO CONSUMIDOR\n===============================================================\n");    
        });
    }, 
    
    analyseBusinessDependency : function (sourceType, maxHoops, elementName) {
        analyseDependency(sourceType, "BusinessProcess", maxHoops, elementName, BIDIRECTIONAL, function (){
            console.log("\n> PROCESSOS DE NEGOCIO SUPORTADOS\n===============================================================\n");
        }, printNodeData);  
        analyseDependency(sourceType, "BusinessActor", maxHoops, elementName, BIDIRECTIONAL, function (){
            console.log("\n> ATORES APOIADOS\n===============================================================\n");
        }, printNodeData); 
    },  
    
    analyseApplicationDependency : function (sourceType, maxHoops, elementName) {
        analyseDependency(sourceType, "ApplicationComponent", maxHoops, elementName, BIDIRECTIONAL, function (){
            console.log("\n> APLICACOES RELACIONADAS\n===============================================================\n");
        }, printNodeData); 
        analyseDependency(sourceType, "ApplicationComponent", 1, elementName, RIGHT, function (){
            console.log("\n> APLICACOES QUE USAM A APLICACAO DIRETAMENTE\n===============================================================\n");
        }, printNodeData); 
        analyseDependency(sourceType, "ApplicationComponent", 1, elementName, LEFT, function (){
            console.log("\n> APLICACOES QUE A APLICACAO FAZ USO DIRETAMENTE\n===============================================================\n");
        }, printNodeData); 
    },
    
    analyseTechnologyDependency : function (sourceType, maxHoops, elementName) {
        analyseDependency(sourceType, "Node", maxHoops, elementName, BIDIRECTIONAL, function (){
            console.log("\n> NOS QUE SUPORTAM A APLICACAO\n===============================================================\n");
        }, printNodeData);  
    },
    
    analyseDataUsage : function (sourceType, maxHoops, elementName) {
        analyseDependency(sourceType, "Artifact", maxHoops, elementName, LEFT, function (){
            console.log("\n> ARTEFATOS ACESSADOS PELA APLICACAO\n===============================================================\n");
        }, printNodeData); 
        analyseDependency(sourceType, "DataObject", maxHoops, elementName, BIDIRECTIONAL, function (){
            console.log("\n> DADOS ACESSADOS PELA APLICACAO\n===============================================================\n");
        }, printNodeData); 
    }       
    
};
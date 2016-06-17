var db = require("seraph")( {
    user: 'neo4j',
    pass: 'test'
});

module.exports = {
    
    getTimePoint : function(isUpdate, insertionCallback) {
        var query = "MATCH (p:Plato) RETURN p.timePoint AS time ORDER BY time DESC";    
        var currentTimePoint = 0;
        
        // Getting the current timePoint
        db.query(query, function (err, result){
            if(err) console.log(err);    
            
            if(result.length > 0){ // Get the plato with the major time point property    
                currentTimePoint = result[0].time;  
                
                if(!isUpdate) // If is not an update, advance the time point by 1
                    currentTimePoint++; 
                else // else, call the insertion routine
                    insertionCallback(currentTimePoint);                    
            }else{ // If there is any plato recorded, then create the first plato with time point 0 (zero)
                currentTimePoint = 0;    
            }  
            
            if(!isUpdate){ // Creating a new Plato node
                var platoInsertionQuery = "CREATE (p:Plato {timePoint:"+currentTimePoint+"})";
                    
                db.query(platoInsertionQuery, function (err, result){     
                    if(err) console.log(err); 
                    
                    insertionCallback(currentTimePoint);
                });     
            }                     
        });    
    },
    
    clearModel : function(timePoint, callback) { // If TimePoint is -1 then clear all the graph
        console.log("Clearing model...");

        var relationshipDeletion = "MATCH (a)-[rel]->(b) $pattern DELETE rel";
        var nodeDeletion = "MATCH (a)$pattern DELETE a";
        
        if(timePoint > -1){
            relationshipDeletion = relationshipDeletion.replace("$pattern", ", (s:Plato {timePoint:"+timePoint+"}) WHERE (a)-->(s)");
            nodeDeletion = nodeDeletion.replace("$pattern", "-->(s:Plato {timePoint:"+timePoint+"})");
        }else{
            relationshipDeletion = relationshipDeletion.replace("$pattern", "");
            nodeDeletion = nodeDeletion.replace("$pattern", "");
        }

        // Running query
        db.query(relationshipDeletion, function (err, resultRelationshipDeletion){
            if(err) console.log(err);    
            
            db.query(nodeDeletion, function (err, resultNodeDeletion){  
                if(err) console.log(err);   
                          
                callback();
            });
        });  
    },
    
    recordNode : function(id, name, type, timePoint, callback) {
        var query = "MATCH (p:Plato {timePoint:$time}) CREATE (n:$type {elementid: \"$id\", name: \"$name\"})-[:PLATO]->(p) RETURN n";
        
        // Replacing mapped query elements 
        query = query.replace("$type", type);
        query = query.replace("$id", id);
        query = query.replace("$name", name);
        query = query.replace("$time", timePoint);

        // Running query
        db.query(query, function (err, result){
            if(err) console.log(err);    
                        
            console.log("NODE > " + name + " recorded");
            callback();
        });    
    },
    
    recordRelationship : function(sourceid, targetid, type) {
        var query = "MATCH (a {elementid: \"$sourceid\"}), (b {elementid: \"$targetid\"}) "+
            "CREATE (a)-[r:$type]->(b) RETURN a, r, b";
        
        // Replacing mapped query elements 
        query = query.replace("$sourceid", sourceid);
        query = query.replace("$targetid", targetid);
        query = query.replace("$type", type);
        
        // Running query
        db.query(query, function (err, result){
            if(err) console.log(err);    
            
            console.log(sourceid + " - " + type  + " -> " + targetid + " recorded");
        });     
    }
    
}

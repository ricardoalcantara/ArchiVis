var db = require("seraph")( {
    user: 'neo4j',
    pass: 'test'
});

module.exports = {
    
    getCurrentTimePoint : function() {
        var query = "MATCH (p:Plato) RETURN p.timePoint ORDER BY p.timePoint DESC";    
        
        // Running query
        db.query(query, function (err, result){
            if(err) console.log(err);    
             
            if(result.length > 0){ // Get the plato with the major time point property        
                return result[0].timePoint;
            }else{ // If there is any plato recorded, then create the first plato with time point 0 (zero)
                var platoInsertionQuery = "CREATE (p:Plato {timePoint:0})";
                
                db.query(platoInsertionQuery, function (err, result){     
                    if(err) console.log(err);
                    
                    return 0;    
                });   
            }       
        });     
    },
    
    clearModel : function(timePoint, callback) { // If TimePoint is -1 then clear all the graph
        var query = "MATCH (a)-[rel]->(b), (d)$pattern DELETE rel, a, b, d$list";
        
        if(timePoint > -1){
            query = query.replace("$pattern", ", (a)-->(s:Plato {timePoint:"+timePoint+"})<--(b), (d)-->(s)");
            query = query.replace("$list", ", s");
        }else{
            query = query.replace("$pattern", "");
            query = query.replace("$list", "");    
        }
        
        // Running query
        db.query(query, function (err, result){
            if(err) console.log(err);    
                        
            callback();
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

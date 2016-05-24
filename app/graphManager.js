var db = require("seraph")( {
    user: 'neo4j',
    pass: 'test'
});

module.exports = {
    
    recordNode : function(id, name, type, callback) {
        var query = "CREATE (n:$type {elementid: \"$id\", name: \"$name\"}) RETURN n";
        
        // Replacing mapped query elements 
        query = query.replace("$type", type);
        query = query.replace("$id", id);
        query = query.replace("$name", name);
        
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

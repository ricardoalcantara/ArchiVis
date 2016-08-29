"use strict";

var db = require("seraph")( {
    user: 'neo4j',
    pass: 'test'
});

const UNKNOWN = 80;
const COMPOSITION = 70;
const AGGREGATION = 60;
const ASSIGNMENT = 50;
const REALIZATION = 40;
const USED_BY = 30;
const ACCESS = 20;
const ASSOCIATION = 10;

const relTypes = "CompositionRelationship|AggregationRelationship|AssignmentRelationship|RealizationRelationship|UsedByRelationship|AccessRelationship|AssociationRelationship";
const q1 = "MATCH (a)-[rel1:"+relTypes+"]->(b)-[rel2:"+relTypes+"]->(c) RETURN a, rel1, rel2, c";
const q2 = "MERGE (a {elementid: \"$sourceid\"}) MERGE (c {elementid: \"$targetid\"}) MERGE (a)-[:$derivatedRelationship {isDerivated: 1}]->(c)";

function getRelationshipPower (structuralRelationship){
	switch (structuralRelationship){
		case "CompositionRelationship": return COMPOSITION;	
		case "AggregationRelationship": return AGGREGATION;
		case "AssignmentRelationship": return ASSIGNMENT;
		case "RealizationRelationship": return REALIZATION;
		case "UsedByRelationship": return USED_BY;
		case "AccessRelationship": return ACCESS;
		case "AssociationRelationship": return ASSOCIATION;
		default: return UNKNOWN;
	}
}

function getWeaker (a, b){
	if(getRelationshipPower(a) <= getRelationshipPower(b)){
		return a;	
	}else{
		return b;
	} 
}

function derivate (structuralRelationships){
	var weakerCandidate = "";
	
	structuralRelationships.forEach(function(el){
		if(getWeaker(weakerCandidate, el)) weakerCandidate = el;		
	});
	
	return weakerCandidate;
}

function extractRelationships (maxHoops, result){
	var relationships = [];
	
	relationships.push(result.rel1.type);
	relationships.push(result.rel2.type);
	
	return relationships;
}

module.exports = {
	
	generateDerivatedRelationships : function (maxHoops){
		var derivatedRelationship;
		var	insertionQuery;
		
		db.query(q1, function(err, result){
			result.forEach(function(el){
				derivatedRelationship = derivate(extractRelationships(maxHoops, el));
				
				insertionQuery = q2.replace("$sourceid", el.a.elementid);
				insertionQuery = insertionQuery.replace("$targetid", el.c.elementid);
				insertionQuery = insertionQuery.replace("$derivatedRelationship", derivatedRelationship);
				
				db.query(insertionQuery, function(err, res){
					if(err) console.log(err);	
				});
			})			
		});
	}
	
}
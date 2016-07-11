# ArchiVis

A friendly web portal for Archimate model navigation, analysis and knowledge generation. 

## Installation

Dependencies:

* NodeJs 5.1.1
* MeteorJS 1.3
* Neo4j 2.3.1

## Importing Data

The ArchiVis project is fully compatible with the Archimate Open Exchange File Format. 
Any tool that has the capability to export to such format is able to provide data for ArchiVis, including the Open-Source free modeling tool [Archi](http://www.archimatetool.com/).

The following elements are considered in the model importing process:

* Motivational Elements
* Business Elements
* Application Elements
* Technology Elements
* Implementation and Migration Elements
* Relationships
* Folder Structure
* Views

## Using as Console

ArchiVis provides a terminal interface for initial use. The development of GUI is on project's roadmap.

# Import Archimate Open Exchange File Format

> `graphConsole.js load [modelFileName]`


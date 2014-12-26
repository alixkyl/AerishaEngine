//var hexlib=require( 'HexMapGenerator');
// var mongoose = require('mongoose');
	// mongoose.connect('mongodb://localhost/test');
	// var db = mongoose.connection;
module.exports=new function(){
	var mapData={};

	this.start=function(handler){
		mapData=require('./data/plop.json');
	}
  
  this.getMapData = function(){
		return mapData;
	
	}
	
	this.getMapDataOf = function(id){
		return mapData[id];
	
	}
	
};
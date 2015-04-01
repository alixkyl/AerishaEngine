"use strict";
/**
** a multi-layered + level of detail, hex height-map tool
**/

// inspirited by
// http://www.redblobgames.com/grids/hexagons/
//	A * * * * B
//	 * * * * * *
//	* * * * * *   an hex-map (q,r) 	A=>0,0
//	 * * * * * *					B=>5,0
//	* * C * * *						C=>0,4
if( Hexmap == undefined)
	var Hexmap = {};

//begin private closure
(function(){
	
	this.Layer = function(option) {
        if (!(this instanceof Hexmap.Layer)){
            return new Hexmap.Layer(option);
		}
		this.type = option.type||'raw';
        //handle the options initialization here
		this.name = this.type,
		//handle other initialization here
		this.points = {};
    };
	
    this.Map = function(option) {
        if (!(this instanceof Hexmap.Map)){
            return new Hexmap.Map(option);
		}
        //handle the options initialization here
		this.width = option.width || 100;
		this.height = option.height || 100;
		
		//handle other initialization here
		this.layers = option.layers || [
			new Hexmap.Layer({type:"base",width:this.width,height:this.height}),	//base layer land/sea
			new Hexmap.Layer({type:"terrain",width:this.width,height:this.height}),	//terrain type
			new Hexmap.Layer({type:"border",width:this.width,height:this.height}),	//border
			new Hexmap.Layer({type:"building",width:this.width,height:this.height})	//building
		];
    };
	this.Map.prototype.DummyMap=function(){
		
		for(var i = 0; i < this.width; i++){
			for(var j = 0; j < this.height; j++){
				var q = i - Math.floor(j/2);
				var r = j;
				this.layers[0].points[q+":"+r] = {
					r:r,
					q:q,
					h:1 
				};
			}
		}
		for(var i = 0; i < this.width; i+=3){
			for(var j = 0; j < this.height; j+=3){
				var q = i - Math.floor(j/2);
				var r = j;
				this.layers[1].points[q+":"+r] = {
					r:r,
					q:q
				};
			}
		}
		
	}
}).call(Hexmap);
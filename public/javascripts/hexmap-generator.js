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
  var Hexmap = {};

 var generate = function(options){
	console.time("generation");
	console.log("options:",options);
	var width = options.width || 100;
	var height = options.height || 100;
	var landSea = options.landSea || 0;
	var seed = options.seed || 0;
	var patchSize = options.patchSize || 20;
	var noiseImpact = options.noiseImpact || 0.1;
	var degree = options.degree || 1;
	console.log("init:", width, height, seed, landSea, patchSize, noiseImpact, degree);
	
	var mapData=[];
	var nurbs = [];
	
	
	
    var simplex = new SimplexNoise(new Alea(seed));
	function simplexPatchKnot(x,y){
		return simplex.noise2D(x, y);
	}
	/**
	*nurbsGenerator
	*/
	function nurbsGenerator(x,y,p,func){
		var controlPoints = [
			[
				[0, func(4*x, 4*y), 0],
				[0, func(4*x, 4*y+p), 1],
				[0, func(4*x, 4*y+2*p), 2],
				[0, func(4*x, 4*y+3*p), 3],
				[0, func(4*x, 4*y+4*p), 4]
			],
			[
				[1, func(4*x+p, 4*y), 0],
				[1, func(4*x+p, 4*y+p), 1],
				[1, func(4*x+p, 4*y+2*p), 2],
				[1, func(4*x+p, 4*y+3*p), 3],
				[1, func(4*x+p, 4*y+4*p), 4]
			],
			[
				[2, func(4*x+2*p, 4*y), 0],
				[2, func(4*x+2*p, 4*y+p), 1],
				[2, func(4*x+2*p, 4*y+2*p), 2],
				[2, func(4*x+2*p, 4*y+3*p), 3],
				[2, func(4*x+2*p, 4*y+4*p), 4]
			],
			[
				[3, func(4*x+3*p, 4*y), 0],
				[3, func(4*x+3*p, 4*y+p), 1],
				[3, func(4*x+3*p, 4*y+2*p), 2],
				[3, func(4*x+3*p, 4*y+3*p), 3],
				[3, func(4*x+3*p, 4*y+4*p), 4]
			],
			[
				[4, func(4*x+4*p, 4*y), 0],
				[4, func(4*x+4*p, 4*y+p), 1],
				[4, func(4*x+4*p, 4*y+2*p), 2],
				[4, func(4*x+4*p, 4*y+3*p), 3],
				[4, func(4*x+4*p, 4*y+4*p), 4]
			]
		];
		
		var degree = 3;
		var knots = [0, 0, 0, 0, 0.5, 1, 1, 1, 1];
		try{
			var nurbsSurface = new verb.geom.NurbsSurface.byKnotsControlPointsWeights( degree, degree, knots, knots, controlPoints);
		}catch(e){
			console.log(e);
		}
		return function(u, v) {
			return nurbsSurface.point(u, v);
		};
	}
	
	/**
	*getNurbsFunction
	*/
	function getNurbsFunction(d,w,h){
		if(!nurbs[d]){nurbs[d]=[];}
		if(!nurbs[d][w]){nurbs[d][w]=[];}
		if(!nurbs[d][w][h]){
			var p = Math.pow(2, d);
			nurbs[d][w][h] = nurbsGenerator(w*p,h*p,p,simplexPatchKnot);
		}
		return nurbs[d][w][h];
	}
	
	/**
	*getHeight
	*/
	function getHeight(hex){
		var result=0;
		for(var d = 0; d < degree; d++){
			
			var impact = 1/Math.pow(2,d),
			size = patchSize*Math.pow(2,degree-d),
			w = Math.floor(hex.j/size),
			h = Math.floor(hex.i/size);
			
			result+=getNurbsFunction(d,w,h)((hex.j-w*size)/size,(hex.i-h*size)/size)[1];
		}
		return Math.max(-1,Math.min(1,result));
	}
	
    var hex;
	for(var i=0;i<height;i++)
	{
		for(var j=0;j<width;j++)
		{
			var r= i ;
			var q = j - Math.floor(i/2);
			hex = {i:i,j:j,r:r,q:q};
			var h = getHeight(hex);
			var variation = simplex.noise2D(hex.r,hex.q)*noiseImpact;
			 hex.height = h+variation+landSea;
			hex.altitude = h;
			mapData.push(hex);
		}
	}	
	console.timeEnd("generation");
	return mapData;
};
//begin private closure
(function(){
	var h = Hexmap;
	
	this.Layer = function(option) {
        if (!(this instanceof Hexmap.Layer)){
            return new Hexmap.Layer(option);
		}
		
        //handle the options initialization here
		this.name = "layer",
		this.q = option.q || 0 ,
		this.r = option.r || 0 ,
		this.width = option.width || 100,
		this.height = option.height|| 100;
		//handle other initialization here
		this.points = {};
    };
	
	this.Layer.prototype.fill = function(option) {
		if(option.seed != undefined){
			var res = generate({width: this.width, height: this.height, seed:option.seed});
			for(var h in res){
				var hex = res[h];
				this.points[(hex.q+this.q)+":"+(hex.r+this.r)] = {q:hex.q+this.q,r:hex.r+this.r,h:hex.altitude*10};
			}
		}else if (option.h != undefined){
			for(var i = 0; i < this.width; i++)
			{
				for(var j = 0; j < this.height; j++)
				{
					var q = this.q + i - Math.floor(j/2);
					var r = this.r + j;
					this.points[q+":"+r] = {r:r,q:q,h:option.h};
				}
			}
		}
    };
	
    this.Map = function(option) {
        if (!(this instanceof Hexmap.Map)){
            return new Hexmap.Map(option);
		}

        //handle the options initialization here
		this.width = option.width || 100;
		this.height = option.height || 100;
		
		//handle other initialization here
		this.layers = [];
		this.addLayer(new Hexmap.Layer({}));
		this.layers[0].fill({q:0,r:0,width:this.width,height:this.height,h:0});
    };
	
	this.Map.prototype.addLayer = function(layer) {
		this.layers.push(layer||new Hexmap.Layer({width:this.width, height: this.height}));
    };
	
	this.Map.prototype.getView = function(toggledLayers) {
		var tmp = {};
		var hex = {};
		var layer = {};
		for( var l =0,len = this.layers.length; l <len; l++ ){
			if(toggledLayers[l]){
				layer = this.layers[l];
				for(var p in layer.points){
					hex = layer.points[p];
					if(tmp[p] == undefined){
						tmp[p]={q:hex.q,r:hex.r,h:hex.h};
					}else{
						tmp[p].h+=hex.h;
					}
				}
			}
		}
		for(var i in tmp){
			Hexmap.defaultConfig.apply(tmp[i]);
		}
		return tmp;
	}
	
	this.defaultConfig = (function(){
		var p={};
		var RADIUS=15;
		function inititateBiome(){
			var height = Math.range(-10,10,1);
			var moist = Math.range(0,10,1);
			
			return height.map(function(p){
				
				if(p>0){
					return '#'+shadeColor(0x00FF00,-p);
				}else if(p<0){
					return '#'+shadeColor(0x0000FF,p);
				}
				
				return '#FFFF00';
				
			});
		}
		var BIOME=inititateBiome();
				

		function shadeColor(color, percent) {
			var num = color,// parseInt(color,16),
			amt = Math.round(2.55 * percent),
			R = (num >> 16) + amt,
			G = (num >> 8 & 0x00FF) + amt,
			B = (num & 0x0000FF) + amt;
			return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
		}

		function getBiomeColor(height,moist){
			return BIOME[Math.clip(Math.floor(height/2),0,4)][Math.clip(Math.floor((1+moist)/4),0,4)];
		}
		var SQRT3=Math.sqrt(3);
		
		p.apply = function (p){
			p.view={
				fill:BIOME[Math.floor(p.h)+10],
				x:RADIUS+RADIUS * SQRT3 * (p.q + p.r/2),
				y:RADIUS+RADIUS * 3/2 * p.r
			}
			return p;
		}
		return p;
	})();
}).call(Hexmap);
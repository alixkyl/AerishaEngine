"use strict";

if( Hexmap == undefined)
	var Hexmap = {};

(function(){
	
	function computeCP(d,x,y,p,func){
		var res = [];
		var offset= d-1;
		for(var i = 0;i<d;i++){
			res[i]=[];
			for(var j = 0; j<d; j++){
				res[i][j]= [i, func(offset*x+i*p, offset*y+j*p), j];
			}
		}
		return res;
	}
	/**
	*nurbsGenerator
	*/
	function nurbsGenerator(x,y,p,func){		
		var degree = 3;
		var knots = [0, 0, 0, 0, 0.5, 1, 1, 1, 1];
		try{
			var nurbsSurface = new verb.geom.NurbsSurface.byKnotsControlPointsWeights( degree, degree, knots, knots, computeCP(knots.length-degree-1,x,y,p,func));
		}catch(e){
			console.log(e);
		}
		return function(u, v) {
			return nurbsSurface.point(u, v);
		};
	}
	
	this.generate = function(options){
		console.time("generation");
		console.log("options:",options);
		var width = options.width || 100;
		var height = options.height || 100;
		var landSea = options.landSea || 0.1;
		var seed = options.seed || 0;
		var patchSize = options.patchSize || 10;
		var multiplier = options.multiplier || 10;
		var noiseImpact = options.noiseImpact || 0.05;
		var degree = options.degree || 3;
		console.log("init:", width, height, seed, landSea, patchSize, noiseImpact, degree);
		
		var mapData={};
		var nurbs = [];
		
		var simplex = new SimplexNoise(new Alea(seed));
		function simplexPatchKnot(x,y){
			return simplex.noise2D(x, y);
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
				hex.h = Math.clamp(h+variation+landSea,-1,1)*multiplier;
				mapData[q+":"+r] = hex;
			}
		}	
		console.timeEnd("generation");
		return mapData; 
	};
	function loadImages(sources, callback) {
			var images = {};
			var loadedImages = 0;
			var numImages = 0;
			// get num of sources
			for(var src in sources) {
				numImages++;
			}
			for(var src in sources) {
				images[src] = new Image();
				images[src].onload = function() {
					if(++loadedImages >= numImages) {
						callback(images);
					}
				};
				images[src].src = sources[src];
			}
		}
		var sources = {
			star: '/images/star.png'
		};
		var imagesLoaded={};
		loadImages(sources, function(images) {
			imagesLoaded = images;
		});
	this.getView = function(map,option,style){
		var view = {
			width: 		map.width*(option.RADIUS * Math.sqrt(3))+option.RADIUS,
			height: 	map.height*(option.RADIUS * 3/2)+option.RADIUS,
			hWidth:	 	map.width,
			hHeight: 	map.height,
			RADIUS: 	option.RADIUS,
			layers:		[]
		};
		
		for(var l = 0, len = map.layers.length; l < len; l++){
			var layer = {
				width:view.width,
				height:view.height,
				type: map.layers[l].type,
				points: {},
				foregrid:{}
			};
			switch(layer.type){
					case 'base':{
						for(var i in map.layers[l].points){
							var p = map.layers[l].points[i];
							layer.points[p.q+":"+p.r] = {
								r:p.r,
								q:p.q,
								x: option.RADIUS + option.RADIUS * SQRT3 * (p.q + p.r/2),
								y: option.RADIUS + option.RADIUS * 3/2 * p.r,
								radius: option.RADIUS,
								fill:style.BIOME[Math.floor(p.h)+10]
							};
						}
						break;
					};
					case 'terrain':{
						for(var i in map.layers[l].points){
							var p = map.layers[l].points[i];
							layer.points[p.q+":"+p.r] = {
								r:p.r,
								q:p.q,
								x: option.RADIUS * SQRT3 * (p.q + p.r/2),
								y: option.RADIUS * 3/2 * p.r,
								size: option.RADIUS * 2,
								fill:imagesLoaded.star
							};
						}
						break;
					};
					case 'border':{
						var R = option.RADIUS/SQRT3;
						for(var i in map.layers[l].points){
							var p = map.layers[l].points[i];
							layer.points[p.id] = {
								r:p.r,
								q:p.q,
								radius: 2,
								a_r:p.a_r,
								a_q:p.a_q,
								b_r:p.b_r,
								b_q:p.b_q,
								a_x: 4 + R * 3/2 * p.a_r,
								a_y: 2-R + R * SQRT3 * (p.a_q + p.a_r/2),
								b_x: 4 + R * 3/2 * p.b_r,
								b_y: 2-R + R * SQRT3 * (p.b_q + p.b_r/2),
								fill:'red'
							};
						}
						break;
					};
					case 'building':{
						for(var i in map.layers[l].points){
							var p = map.layers[l].points[i];
							layer.points[p.q+":"+p.r] = {
								r:p.r,
								q:p.q,
								x: option.RADIUS * SQRT3 * (p.q + p.r/2),
								y: option.RADIUS * 3/2 * p.r,
								size: option.RADIUS*2,
								fill:imagesLoaded.star
							};
						}
						break;
					};
				};
			view.layers[l] = layer;
		}
		return view;
	};
	this.getHexInRange=function(center, range, set){
		var result=[];
		for(var dq = -range;dq <= range;dq++){
			for(var dr=Math.max(-range,-dq-range);dr<=Math.min(range,-dq+range);dr++){				
				result.push({q:center.q+dq,r:center.r+dr});
			}
		}
		return result;
	}
	this.defaultConfig = (function(){
		var p={};
		var RADIUS=15;
		function inititateBiome(){
			var height = Math.range(-10,10,1);
			var moist = Math.range(0,10,1);
			
			return height.map(function(p){
				if(p>0){
					return '#'+shadeColor(0x00FF00,(-p/10)*100);
				}else if(p<0){
					return '#'+shadeColor(0x0000FF,(p/10)*100);
				}
				return '#FFFF00';
			});
		};
		
		p.BIOME=inititateBiome();

		function shadeColor(color, percent) {
			var num = color,// parseInt(color,16),
			amt = Math.round(2.55 * percent),
			R = (num >> 16) + amt,
			G = (num >> 8 & 0x00FF) + amt,
			B = (num & 0x0000FF) + amt;
			return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
		}

		function getBiomeColor(height,moist){
			return BIOME[Math.clamp(Math.floor(height/2),0,4)][Math.clamp(Math.floor((1+moist)/4),0,4)];
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
var Alea = require('alea');
var SimplexNoise = require('simplex-noise');
var THREE = require('three');
global.THREE=THREE;
require('./NURBSSurface.js');


// var neighbors =  [
		// [+1,  0],  [+1, -1],  [ 0, -1],
		// [-1,  0],  [-1, +1],  [ 0, +1] 
	// ] ;
// /**
// *
// *
// *
// */
// function getNeighbor(r,q,direction,mapData){
	// return mapData[(r + neighbors[direction][0])+"_"+(q + neighbors[direction][1])];
// }
// /**
// *
// *
// *
// */
// function getNeighbors(h,mapData){
	// var neighbors=[];
		// for(var i=0;i<6;i++){
			// var n=getNeighbor(h.r,h.q,i,mapData);
			// if(n){
				// neighbors[i]=n;
			// }
		// }
	// return neighbors;
// }

/**
*
*
*
*/
function normalizeOffset(o){
	if(o === -2){
		return 1;
	}
	if(o === -1){
		return 2;
	}
	return o;
}

/**
*
*
*
*/
function cubic2grid(r,q){
	var x = Math.sqrt(3) * (q + r/2);
	var y = 3/2 * r;
	return {x:x,y:y};
}
/**
*
*
*
*/
function nurbsGenerator(func, patch){
	
	var nsControlPoints = [
		[
			new THREE.Vector4 ( 0, func(patch, 0, 0), 0, 1 ),
			new THREE.Vector4 ( 0, func(patch, 0, 1), 5, 1 ),
			new THREE.Vector4 ( 0, func(patch, 0, 2), 10, 1 )
		],
		[
			new THREE.Vector4 ( 5, func(patch, 1, 0), 0, 1 ),
			new THREE.Vector4 ( 5, func(patch, 1, 1), 5, 1 ),
			new THREE.Vector4 ( 5, func(patch, 1, 2), 10, 1 )
		],
		[
			new THREE.Vector4 ( 10, func(patch, 2, 0), 0, 1 ),
			new THREE.Vector4 ( 10, func(patch, 2, 1), 5, 1 ),
			new THREE.Vector4 ( 10, func(patch, 2, 2), 10, 1 )
		]
	];
	var degree1 = 2;
	var degree2 = 2;
	var knots1 = [0, 0, 0, 1, 1, 1];
	var knots2 = [0, 0, 0, 1, 1, 1];
	var nurbsSurface = new THREE.NURBSSurface(degree1, degree2, knots1, knots2, nsControlPoints);

	return function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};
}
/**
*
*
*
*/
function makeHexVariation(hex, seed, patchSize, degree){
	var result=0;
	function hexVar(patch, rfx,rfy){
		var dfy=0;
		
		if(hex.r<0){
			dfy=hex.r-(patch-Math.abs(hex.r%patch));
		}
		else{
			dfy=hex.r-Math.abs(hex.r%patch);
		}
			
		var dfx=0;
		if(hex.q<0){
			dfx=hex.q-(patch-Math.abs(hex.q%patch));
		}
		else{
			dfx=hex.q-Math.abs(hex.q%patch);
		}
		var dr=0/1;
		var dq=0/1;
		
		if(rfx===1){
			dq = patch/2;
		}
		else if(rfx===2){
			dq = patch/1;
		}
		if(rfy===1){
			dr = patch/2;
		}
		else if(rfy===2){
			dr = patch/1;
		}
		var vr = dfy + dr;
		var vq = dfx + dq;
		
		var co = cubic2grid(vr,vq);
		
		return simplex.noise2D(co.x, co.y);
	}
	for(var i=1; i<=degree; i++){
		var simplex = new SimplexNoise(new Alea(seed*i));
		var patch=patchSize*Math.pow(2,i-1);
		var fh=nurbsGenerator(hexVar, patch);
		var dcr=0;
		if(hex.r<0){
			dcr=(patch-Math.abs(hex.r%patch))/patch;
		}
		else{
			dcr=Math.abs(hex.r%patch)/patch;
		}
		var dcq=0;
		if(hex.q<0){
			dcq=(patch-Math.abs(hex.q%patch))/patch;
		}
		else{
			dcq=Math.abs(hex.q%patch)/patch;
		}
		var zsq=fh(dcq,dcr).y;
		result=result+zsq/Math.pow(2,degree-i);
	}
	return result;
}



/**
*
*
*
*/
module.exports.generateMap = function(size,seed,patchSize,noiseImpact){
	var mapData=[];
    var simplex = new SimplexNoise(new Alea(seed+1));
    // var simplexH = new SimplexNoise(new Alea(seed*2));
    
	for(var i=0;i<size;i++)
	{
		for(var j=0;j<size;j++)
		{
			var r= i ;
			var q = j - Math.floor(i/2);
			mapData.push( {name: r+"_"+q, r:r,q:q,height:0,moist:0 });
		}
	}
	
	
	// N=3
	// for(r=-N;r<=N;r++)
		// for(q=Math.max(-N, -r-N);q<=Math.min(N, -r+N);q++)
		// {
			// mapData[(r+delta.r)+"_"+(q+delta.q)] = {_id:(r+delta.r)+"_"+(q+delta.q), name: (r+delta.r)+"_"+(q+delta.q), r:r+delta.r,q:q+delta.q,heigh:0,moist:0 }
	
	
		// }
	
	console.log("initGeneration");
	var landSea=0.1;
	var stepMap={};
	function hexGen(rfx,rfy){
			var dfy=0;
			
			if(d.r<0){
				dfy=d.r-(p2-Math.abs(d.r%p2));
			}
			else{
				dfy=d.r-Math.abs(d.r%p2);
			}
			var dfx=0;
			if(d.q<0){
				dfx=d.q-(p2-Math.abs(d.q%p2));
			}
			else{
				dfx=d.q-Math.abs(d.q%p2);
			}
			var dr=0/1;
			var dq=0/1;
			
			if(rfx===1){
				dq = p2/2;
			}
			else if(rfx===2){
				dq = p2/1;
			}	
			if(rfy===1){
				dr = p2/2;
			}
			else if(rfy===2){
				dr = p2/1;
			}	
			var vr = dfy + dr;
			var vq = dfx + dq;
			
			var co = cubic2grid(vr,vq);
			
			return simplex.noise2D(co.x, co.y);
		}
	for(var h in mapData) {
		var d=mapData[h];
		var offR = normalizeOffset(d.r%3);
		var offQ = normalizeOffset(d.q%3);
		var coord = cubic2grid(d.r,d.q);
		var e=0;
		if(offR===0 && offQ===1){
			coord = cubic2grid(d.r,d.q-1);
			e=simplex.noise2D(coord.x, coord.y);
		}else if(offR===0 && offQ===2){
			coord = cubic2grid(d.r,d.q+1);
			e=simplex.noise2D(coord.x, coord.y);
		}else if(offR===1 && offQ===0){
			coord = cubic2grid(d.r-1,d.q);
			e=simplex.noise2D(coord.x, coord.y);
		}else if(offR===1 && offQ===1){
			coord = cubic2grid(d.r-1,d.q-2);
			e=simplex.noise2D(coord.x, coord.y);
			coord = cubic2grid(d.r+2,d.q-1);
			e+=simplex.noise2D(coord.x, coord.y);
			coord = cubic2grid(d.r-1,d.q+2);
			e+=simplex.noise2D(coord.x, coord.y);
			e/=3;
		}else if(offR===1 && offQ===2){
			coord = cubic2grid(d.r-1,d.q+1);
			e=0.8*simplex.noise2D(coord.x, coord.y);
		}else if(offR===2 && offQ===0){
			coord = cubic2grid(d.r+1,d.q);
			e=simplex.noise2D(coord.x, coord.y);
		}else if(offR===2 && offQ===1){
			coord = cubic2grid(d.r+1,d.q-1);
			e=simplex.noise2D(coord.x, coord.y);
		}else if(offR===2 && offQ===2){
			coord = cubic2grid(d.r-1,d.q+1);
			e=simplex.noise2D(coord.x, coord.y);
		}else if(offR===0 && offQ===0){
			coord = cubic2grid(d.r,d.q);
			e=simplex.noise2D(coord.x, coord.y);
		}
		
		var p2=100;
		var fh=nurbsGenerator(hexGen);
		
		var dcr=0;
		if(d.r<0){
			dcr=(p2-Math.abs(d.r%p2))/p2;
		}
		else{
			dcr=Math.abs(d.r%p2)/p2;
		}
		var dcq=0;
		if(d.q<0){
			dcq=(p2-Math.abs(d.q%p2))/p2;
		}
		else{
			dcq=Math.abs(d.q%p2)/p2;
		}
		var coefH=fh(dcq,dcr);
		stepMap[h]={elevation:makeHexVariation(d,seed,patchSize,3)+e*noiseImpact+landSea,humidity:coefH.y};
	}
	console.log("step1");
	

	console.log("step2");
	console.log("Finalstep");
	for(h in mapData) {
		mapData[h].height=Math.floor(stepMap[h].elevation*10);
		mapData[h].moist=Math.floor(stepMap[h].humidity*10);
	}
	console.log("open");
	return mapData;
};

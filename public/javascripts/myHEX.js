(function() {
var biome=[
	[0x70F205,0x00FA5C,0x00FA5C,0x21CF1B,0x098C04],
	[0xFAE25C,0x00FA5C,0xCDFA5C,0x21CF1B,0x098C04],
	[0xFAE25C,0x00FA5C,0x00FA5C,0x21CF1B,0x098C04],
	[0xFAE25C,0x00FA5C,0x00FA5C,0x21CF1B,0x098C04],
	[0x9EA8A5,0x00FA5C,0x00FA5C,0x00FFA2,0x00FFA2]
];
Math.clip = function(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

function shadeColor(color, percent) {   
    var num = color,// parseInt(color,16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
    return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

function getBiomeColor(height,moist){
	return biome[Math.clip(Math.floor(height/2),0,4)][Math.clip(Math.floor((1+moist)/4),0,4)];
}

d3.hexbin = function() {
	var width = 1;
    var height = 1;
    var size;

	function hexbin(points) {
		var binsById = {};

		points.forEach(function(point, i) {
			var id = point.q + "_" + point.r; 
			binsById[id] = point;
			binsById[id].x = size * Math.sqrt(3) * (point.q + point.r/2);
			binsById[id].y = size * 3/2 * point.r;
			if(point.height<0)
				binsById[id].fill='#'+shadeColor(0x0000FF,point.height*10);
			else if(point.height>=0)
				binsById[id].fill='#'+shadeColor(getBiomeColor(point.height,point.moist),-point.height*10);
				// binsById[id].fill='#'+shadeColor(0x00FF00,(1+point.moist)*5);
			
		});
		return d3.values(binsById);
	}

	function hexagon(radius) {
		var x0 = 0, y0 = 0;
		return d3_hexbinAngles.map(function(angle) {
		  var x1 = Math.sin(angle) * radius,
			  y1 = -Math.cos(angle) * radius,
			  dx = x1 - x0,
			  dy = y1 - y0;
		  x0 = x1, y0 = y1;
		  return [dx, dy];
		});
	}
	hexbin.fill=function(_){
		if (!arguments.length) return fill;
		fill = _;
		return hexbin;
	}
	hexbin.x = function(_) {
		if (!arguments.length) return x;
		x = _;
		return hexbin;
	};

	hexbin.y = function(_) {
		if (!arguments.length) return y;
		y = _;
		return hexbin;
	};

  hexbin.hexagon = function() {
    return "m" + hexagon(size-0.2).join("l") + "z";
  };

  hexbin.centers = function() {
    var centers = [];
    for (var y = 0, odd = false; y < height + r; y += dy, odd = !odd) {
      for (var x = odd ? dx / 2 : 0; x < width; x += dx) {
        centers.push([x, y]);
      }
    }
    return centers;
  };

  hexbin.mesh = function() {
    var fragment = hexagon(size).slice(0, 4).join("l");
    return hexbin.centers().map(function(p) { return "M" + p + "m" + fragment; }).join("");
  };

  hexbin.size = function(_) {
    if (!arguments.length) return [width, height];
    width = +_[0], height = +_[1];
    return hexbin;
  };

  hexbin.radius = function(_) {
    if (!arguments.length) return size;
    size = +_;
    return hexbin;
  };

  return hexbin.radius(1);
};

var d3_hexbinAngles = d3.range(0, 2 * Math.PI, Math.PI / 3);

})();
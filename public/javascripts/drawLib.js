function draw(drawConfig, data){
	var i=0;
	var points = [];
	for (var hex in data) {
	  points[i++]=data[hex];
	}
	var hexbin = d3.hexbin();
	hexbin.size([drawConfig.width, drawConfig.height]);
	hexbin.radius(drawConfig.radius);
	var chex=drawConfig.g.selectAll(".hexagon")
		.data(hexbin(points), function(d) { return d.name+d.q+d.r; })
		.attr("class", "old");
	
	chex.enter().append("g")
		.attr("class", "hexagon")
		.attr("transform", function(d) { return "translate("+ (d.x +drawConfig.offsetWidth) + ","+ (d.y+drawConfig.offsetHeight) + ")"; })
		.on("click", function(d){
			drawConfig.onclick(d);
		})
	
	chex.append("path")
		.attr("d", function(d) { return hexbin.hexagon(); })
		.attr('fill', function(d){return d.fill;})
		.on("mouseover", function(d){d3.select(this).style("fill", "black");})
		.on("mouseout", function(d){d3.select(this).style("fill", d.fill);});
	
	//chex.append("image")
	//	.attr("xlink:href", function(d) {return d.img;})
	//	.attr("x", -10)
	//	.attr("y", -10)
	//	.attr("width", 20)
	//	.attr("height", 20);
	
	chex.exit().remove();
};

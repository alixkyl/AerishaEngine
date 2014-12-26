function start(){
	var margin = {top: 0, right: 0, bottom: 0, left: 0};
	var drawConfig = {};
	drawConfig.radius = 5;
	drawConfig.offsetWidth = 10;
	drawConfig.offsetHeight = 10;
	var socket = io.connect('/editor');
	
	document.oncontextmenu = function() {
		return false;
	};
	
	var zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);
	
	$('document').dblclick(function (e) {
		e.preventDefault();
	}); 
	var svg = d3.select("#drawArea").append("svg")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.right + ")")
		.call(zoom);
	var rect = svg.append("rect")
    .attr("width", $('#drawArea').width())
    .attr("height", $('#drawArea').height())
    .style("fill", "black")
    .style("pointer-events", "all");
	
	drawConfig.g = svg.append("g");
	var elFocus;
	drawConfig.onclick=function(data,hex){
		if(elFocus){
			elFocus.style('stroke', 'none');
			elFocus.style('stroke-width', '0px');
		}
		elFocus = d3.select(d3.event.target);
		elFocus.style('stroke', '#F00');
		elFocus.style('stroke-width', '1px');
		d3.select('#sidebar').select('div').remove();
		popup = d3.select('#sidebar').append('div');
            popup.append("h2").text(data._id);
            popup.append("p").text("height: " + data.height );
            popup.append("p").text("moist: " + data.moist );
	};
	
	socket.on('maj', function (data) {
		draw(drawConfig,data);
	});
	
	function zoomed() {
	  drawConfig.g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	};
	
	socket.emit('move',{r:0,q:0});
}

// function transition(svg, start, end) {
  // var center = [500 / 2, 500 / 2],
      // i = d3.interpolateZoom(start, end);
    // console.log("ddd");

  // svg
      // .attr("transform", transform(start))
    // .transition()
      // .delay(250)
      // .duration(i.duration * 2)
      // .attrTween("transform", function() { return function(t) { return transform(i(t)); }; })
      // .each("end", function() {  });

  // function transform(p) {
    // return "translate(" + (center[0] - p[0]) + "," + (center[1] - p[1]) + ")";
  // }
// }
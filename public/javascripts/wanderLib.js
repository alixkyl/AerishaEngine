function start(){
	var margin = {top: 0, right: 0, bottom: 0, left: 0};
	var drawConfig = {};
	drawConfig.radius = 30;
	drawConfig.width = $("#drawArea").width() - margin.left - margin.right;
	drawConfig.height = $("#drawArea").height() - margin.top - margin.bottom;
	var socket = io.connect('/wander');
	document.oncontextmenu = function() {
		return false;
	}
	$('document').dblclick(function (e) {
		e.preventDefault();
	}); 
	var svg = d3.select("#drawArea")
		.append("svg");
	svg.attr("width","100%");
	svg.attr("height","100%");
	drawConfig.g = svg.append("g");
	drawConfig.onclick=function(data){
		socket.emit('move',data);
	};
	

	socket.on('maj', function (data) {
		draw(drawConfig,data);
	});
	
	socket.emit('move',{r:0,q:0});
}

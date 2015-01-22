(function(){
var app = angular.module('editor-map',['d3'])

app.directive('infobox', function() {
	return {
		restrict:'E',
		scope:{focus:'='},
		templateUrl: 'editor/edt-map-infobox.html'
	};
});

app.directive('drawarea',['d3Service', function(d3Service) {
    return {
		restrict:'E',
		scope:{data:'=',focus:'='},
		link: function(scope, element, attrs) {
			d3Service.d3().then(function(d3) {
				var margin = parseInt(attrs.margin) || 0;
				var drawConfig = {};
				drawConfig.radius = 3;
				drawConfig.offsetWidth = 10;
				drawConfig.offsetHeight = 10;
				
				document.oncontextmenu = function() {
					return false;
				};
				
				function zoomed() {
					if(d3.event.translate[0]>0){
						d3.event.translate[0]=0;
					}
					if(d3.event.translate[1]>0){
						d3.event.translate[1]=0;
					}
					
					if(d3.event.translate[0]<(-500*d3.event.scale)){
						d3.event.translate[0]=(-500*d3.event.scale);
					}
					if(d3.event.translate[1]<(-500*d3.event.scale)){
						d3.event.translate[1]=(-500*d3.event.scale);
					}
					
				  drawConfig.g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
				};
				
				var zoom = d3.behavior.zoom()
				.scaleExtent([1, 10])
				.on("zoom", zoomed);
				
				$('document').dblclick(function (e) {
					e.preventDefault();
				}); 
				var svg = d3.select(element[0]).append("svg")
					.append("g")
					.attr("transform", "translate(" + margin + "," + margin + ")")
					.call(zoom);
				var rect = svg.append("rect")
				.attr("width", "500px")
				.attr("height", "500px")
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
					scope.focus=data;
					scope.$apply();
				};
				
				// Browser onresize event
				window.onresize = function() {
					scope.$apply();
				};

				// Watch for resize event
				// scope.$watch(function() {
					// return angular.element($window)[0].innerWidth;
				// }, function() {
					// scope.render(scope.data);
				// });
				
				scope.$watch('data', function(newVals, oldVals) {
					return scope.render(newVals);
				}, true);

				scope.render = function(data) {
					drawConfig.g.selectAll('*').remove();
					
					if (!data) return;
					
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
			});
		}
	};
}]);
app.directive('editorMap', ['socket',function(socket) {
	return {
		require:['infobox','drawarea'],
		restrict:'E',
		scope:{data:'='},
		templateUrl: 'editor/edt-map.html',
		controller:function($scope){
			$scope.focus={};
			socket.on('maj', function (data) {
				$scope.data=data;
				$scope.focus=data[0];
				console.log("Done");
			});
		},
		controllerAs:"map"
	};
}]);
})();
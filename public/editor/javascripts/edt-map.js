(function(){
var app = angular.module('editor-map',[])

app.directive('infobox', function() {
	return {
		restrict:'E',
		scope:{focus:'='},
		templateUrl: 'editor/templates/edt-map-infobox.html'
	};
});
app.directive('drawareaCanvas',function(){
	return{
		scope : {data:'=',focus:'='},
		restrict : 'A',
		link : function(scope,element,attrs){
			function getPath(radius){
				var angles = Math.range(0, 2 * Math.PI, Math.PI / 3);
				var vertex = angles.map(function(angle) {return Math.sin(angle) * radius+" "+ -Math.cos(angle) * radius;});
				var path = vertex[0];
				for(var i = 1 ; i < vertex.length ; i++){
					path+=" L "+vertex[i];
				}
				path+=" z";
				return path;
			};
			var RADIUS=15;
			var path= getPath(RADIUS);
			function inititateBiome(){
				var height = Math.range(-10,10,1);
				var moist = Math.range(0,10,1);
				console.log(height);
				return height.map(function(p){
					
					if(p>0){
						return '#'+shadeColor(0x00FF00,p*10);
					}else if(p<0){
						return '#'+shadeColor(0x0000FF,p*10);
					}else{
						return '#FFFF00';
					}
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
			function initiateView(p){
				p.view={
					fill:BIOME[p.height+10],
					path : path,
					x:RADIUS+RADIUS * SQRT3 * (p.q + p.r/2),
					y:RADIUS+RADIUS * 3/2 * p.r
				}
				return p;
			}
			function hexbin(points) {return points.map(function(p) {return initiateView(p);});}
			// if(point.height<0)
						// point.fill='#'+shadeColor(0x0000FF,point.height*10);
					// else if(point.height>=0)
						// point.fill='#'+shadeColor(getBiomeColor(point.height,point.moist),-point.height*10);
						// // binsById[id].fill='#'+shadeColor(0x00FF00,(1+point.moist)*5);
			scope.$watchCollection('data', function(newVals, oldVals) {
					if (!newVals) return;
					console.time("concatenation");
					scope.initiateData(hexbin(newVals));
					scope.render();
					console.timeEnd("concatenation");
					return ;
				}, true);
			
		},
		controller:function($scope,$element){
			
			var width = $($element[0]).width();
			var height = $($element[0]).height();
			var stage = new Konva.Stage({
					container: $element[0],
					width: width,
					height: height
				});
			var layer = new Konva.Layer();
			stage.add(layer);
			var g = new Konva.Group({
				draggable: true,
				dragBoundFunc: function(pos) {
					var newX = pos.x > 0 ? 0 : pos.x;
					newX = newX < layer.width()-(200*(15 * Math.sqrt(3))+15) ? layer.width()-(200*(15 * Math.sqrt(3))+15) : newX;
					var newY = pos.y > 0 ? 0 : pos.y;
					newY = newY < layer.height()-(200*(15 * 3/2)+15) ? layer.height()-(200*(15 * 3/2)+15) : newY;
					return {
						x: newX,
						y: newY
					};
				}
			});
			
			layer.add(g);
			
			var box;
			// generate hexes
			$scope.initiateData=function(points){
				for (var i = 0; i<points.length; i++) {
					var curr=points[i];
					box = new Konva.Path({
						id : i,
						x : curr.view.x ,
						y : curr.view.y ,
						data: curr.view.path,
						fill : curr.view.fill
					});
					g.add(box);
				}
			}
			
			$scope.render=function(){
				g.cache({
					width: 200*(15 * Math.sqrt(3))+15,
					height: 200*(15 * 3/2)+15,
					x : g.x(),
					y : g.y(),
					drawBorder: false
				});
				layer.draw();
			}
			
			// as all boxes stay separately with no overlap
			// and they have no opacity
			// we can call 'box.draw()' and we will have expected result
			// REMEMBER that is this case box will be drawn on top of existing layer
			// without clearing
			layer.on('mouseover', function(evt) {
				var box = evt.target;
				$scope.focus=$scope.data[box.id()];
				$scope.$apply();
				box.fill('#EE0000');
				box.draw();
			});
			layer.on('mouseout', function(evt) {
				var box = evt.target;
				box.fill($scope.data[box.id()].view.fill);
				box.draw();
			});
		}
	};
});
// app.directive('drawarea',['d3Service', function(d3Service) {
    // return {
		// scope:{data:'=',focus:'='},
		// restrict:'E',
		// templateUrl:'editor/templates/edt-map-drawarea.html',
		
		// link: function(scope, element, attrs, controllers) {
			// d3Service.d3().then(function(d3) {
				// var margin = parseInt(attrs.margin) || 0;
				// var drawConfig = {};
				// var hexbin = d3.hexbin();
				// hexbin.size([3, 3]);
				// hexbin.radius(3);
				// var hexagon = hexbin.hexagon();
				// // document.oncontextmenu = function() {
					// // return false;
				// // };
				
				
				
				// var zoom = d3.behavior.zoom()
				// .scaleExtent([1, 10])
				// .on("zoom", zoomed);
				
				// $('document').dblclick(function (e) {
					// e.preventDefault();
				// });
				
				
				// var svg = d3.select(element[0]).select("svg");
				// var groot = svg.select("g");
				// drawConfig.g = groot.select("g");
				
				// function zoomed() {
					// var trans=zoom.translate();
					// if(trans[0]>0){
						// trans[0]=0;
					// }
					// if(trans[1]>0){
						// trans[1]=0;
					// }
					// var val=drawConfig.g.node().getBoundingClientRect();
					// var valbox=svg.node().getBoundingClientRect();
					
					// if(val.width>valbox.width){
						// if(trans[0]<-(val.width-valbox.width)){
							// trans[0]=-(val.width-valbox.width);
						// }
					// }else{
						// trans[0]=0;
					// }
					// if(val.height>valbox.height){
						// if(trans[1]<-(val.height-valbox.height)){
							// trans[1] = -(val.height-valbox.height);
						// }
					// }else{
						// trans[1] = 0;
					// }
					// zoom.translate(trans);
					// drawConfig.g.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");
				// };
				// groot.attr("transform", "translate(" + margin + "," + margin + ")")
				// .call(zoom);
				
				// var elFocus;
				
				// drawConfig.onclick=function(data,hex){
					// if(elFocus){
						// elFocus.style('stroke', 'none');
						// elFocus.style('stroke-width', '0px');
					// }
					// elFocus = d3.select(d3.event.target);
					// elFocus.style('stroke', '#F00');
					// elFocus.style('stroke-width', '1px');
					// scope.focus=data;
					// scope.$apply();
				// };
				
				// // Browser onresize event
				// window.onresize = function() {
					// scope.$apply();
				// };

				// //Watch for resize event
				// // scope.$watch(function() {
					// // return angular.element(window)[0].innerWidth;
				// // }, function() {
					// // scope.render();
				// // });
				// var points = [];
				// scope.$watch('data', function(newVals, oldVals) {
					// if (!newVals) return;
					// console.time("concatenation");
					// points = hexbin(newVals);
					// console.timeEnd("concatenation");
					// return scope.render(points);
				// }, true);

				// scope.render = function(data) {
					// console.time("render");
					// var chex=drawConfig.g.selectAll("hexagon")
						// .data(points, function(d) {return d._id;});
					
					// chex.enter().append("g")
						// .attr("transform", function(d) { return "translate("+ (d.x) + ","+ (d.y) + ")"; })
						// .on("click", function(d){
							// drawConfig.onclick(d);
						// })
						// .append("path")
						// .attr("d", function(d) { return hexagon;})
						// .attr('fill', function(d){return d.fill;})
						// .on("mouseover", function(d){d3.select(this).style("fill", "black");})
						// .on("mouseout", function(d){d3.select(this).style("fill", d.fill);});
					
					// chex.exit().remove();
					// console.timeEnd("render");
					
				// };
			// });
		// }
	// };
// }]);

app.directive('editorMap', ['socket',function(socket) {
	return {
		restrict:'A',
		scope:{data:'='},
		templateUrl: 'editor/templates/edt-map.html',
		controller:function($scope){
			$scope.focus={};
			$scope.remMap=function(){
				socket.emit('remMap',$scope.data._id);
				$scope.data={};
				$scope.focus={}
			}
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
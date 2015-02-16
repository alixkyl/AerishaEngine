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
				var height = Math.range(-100,100,1);
				var moist = Math.range(0,10,1);
				
				return height.map(function(p){
					
					if(p>0){
						return '#'+shadeColor(0x00FF00,-p);
					}else if(p<0){
						return '#'+shadeColor(0x0000FF,p);
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
					fill:BIOME[Math.floor(p.height*100)+100],
					path : path,
					x:RADIUS+RADIUS * SQRT3 * (p.q + p.r/2),
					y:RADIUS+RADIUS * 3/2 * p.r
				}
				return p;
			}
			function hexbin(points) {return points.map(function(p) {return initiateView(p);});}
			
			scope.$watchCollection('data', function(newVals, oldVals) {
					if (!newVals) return;
					scope.points=hexbin(newVals.hexs);
					scope.initiateData(newVals.width,newVals.height);
					scope.render();
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
			
			var root = new Konva.Group({
				draggable: true,
				dragBoundFunc: function(pos) {
					var newX = pos.x;
					if(pos.x > 0 || root.getScale().x*root.width() < stage.width()){
						newX = 0 ;
					}else if(newX < stage.width() - (root.getScale().x * root.width())){
						newX = stage.width() - (root.getScale().x * root.width());
					}
					var newY = pos.y;
					if(pos.y > 0 || root.getScale().y * root.height() < stage.height()){
						newY = 0 ;
					}else if(newY < stage.height() - (root.getScale().y * root.height())){
						newY = stage.height() - (root.getScale().y * root.height());
					}
					return {
						x: newX,
						y: newY
					};
				}
			});
			var background = new Konva.Group();
			var midground = new Konva.Group();
			var foreground = new Konva.Group();
			root.add(background);
			root.add(midground);
			root.add(foreground);
			layer.add(root);
			var focused;
			// generate hexes
			$scope.initiateData=function(width, height){
				background.destroyChildren();
				root.width(width*(15 * Math.sqrt(3))+15);
				root.height(height*(15 * 3/2)+15);
				for (var i = 0; i<$scope.points.length; i++) {
					var curr=$scope.points[i];
					background.add(new Konva.Path({
						id : i,
						x : curr.view.x ,
						y : curr.view.y ,
						data: curr.view.path,
						fill : curr.view.fill,
						stroke:'#000000',
						strokeEnabled:false
					}));
				}
				background.cache({
					width: root.width(),
					height: root.height(),
					x : background.x(),
					y : background.y()
				});
			};
			
			$scope.render=function(){
				root.scale({
					x : 0.1,
					y : 0.1
				});
				layer.draw();
			}
			
			background.on('mouseover', function(evt) {
				var target = evt.target;
				target.fill('#EE0000');
				target.draw();
			});
			background.on('mouseout', function(evt) {
				var target = evt.target;
				target.fill($scope.points[target.id()].view.fill);
				layer.draw();
			});
			
			background.on('click', function(evt) {
				if(!focused){
					focused = evt.target.clone();
					focused.fill('#ffffff');
					focused.strokeEnabled(true);
					foreground.add(focused);
					focused.opacity(0.5)
				}
				focused.x(evt.target.x());
				focused.y(evt.target.y());
				$scope.focus=$scope.points[evt.target.id()];
				
				layer.draw();
				$scope.$apply();
			});
			layer.on('mousewheel', function(e) {
				var zoomAmount = (e.evt.wheelDelta/120)*0.01;
				if((root.getScale().x+zoomAmount)>0.1 && (root.getScale().x+zoomAmount)<1){
					root.setScale({x : root.getScale().x+zoomAmount,
						y : root.getScale().y+zoomAmount
					});
					layer.draw();
				}
			});
		}
	};
});


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
				$scope.focus={};
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
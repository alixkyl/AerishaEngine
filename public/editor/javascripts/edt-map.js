"use strict";
(function(){
var app = angular.module('editor-map',[])


app.directive('infobox', function() {
	return {
		restrict : 'E',
		scope : true,
		templateUrl : 'editor/templates/edt-map-infobox.html',
		controller : function($scope){
			
		}
	};
});
app.directive('drawareaCanvas',function(){
	return{
		scope : {view:'=',focus:'='},
		restrict : 'A',
		controller:function($scope,$element){
			$scope.$watch('view', 
				function(newVals, oldVals) {
					if (!newVals) return;
					console.time("draw");
					initiateData();
					render();
					console.timeEnd("draw");
					return ;
				}, true);
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
					if(pos.x > 0 || root.scaleX()*root.width() < stage.width()){
						newX = 0 ;
					}else if(newX < stage.width() - (root.scaleX() * root.width())){
						newX = stage.width() - (root.scaleX() * root.width());
					}
					var newY = pos.y;
					if(pos.y > 0 || root.scaleY() * root.height() < stage.height()){
						newY = 0 ;
					}else if(newY < stage.height() - (root.scaleY() * root.height())){
						newY = stage.height() - (root.scaleY() * root.height());
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
			function initiateData(){
				background.destroyChildren();
				root.width(100*(15 * Math.sqrt(3))+15);
				root.height(100*(15 * 3/2)+15);
				for (var p in  $scope.view) {
					var curr=$scope.view[p];
					background.add(new Konva.RegularPolygon({
						id: p,
						x: curr.view.x,
						y: curr.view.y,
						sides: 6,
						radius: 15,
						fill : curr.view.fill
					}));
				}
				background.cache({
					width: root.width(),
					height: root.height(),
					x : background.x(),
					y : background.y()
				});
			};
			
			function render(){
				layer.draw();
			}
			
			background.on('mouseover', function(evt) {
				var target = evt.target;
				target.fill('#EE0000');
				target.draw();
			});
			background.on('mouseout', function(evt) {
				var target = evt.target;
				target.fill($scope.view[target.id()].view.fill);
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
				$scope.focus=$scope.view[evt.target.id()];
				
				layer.draw();
				$scope.$apply();
			});
			layer.on('mousewheel', function(e) {
				var zoomAmount = (e.evt.wheelDelta/120)*0.01;
				if((root.scaleX()+zoomAmount)>0.1 && (root.scaleX()+zoomAmount)<1){
					root.scaleX(root.scaleX()+zoomAmount);
					root.scaleY(root.scaleY()+zoomAmount);
					var newX = root.x();
					if(root.x() > 0 || root.scaleX()*root.width() < stage.width()){
						newX = 0 ;
					}else if(newX < stage.width() - (root.scaleX() * root.width())){
						newX = stage.width() - (root.scaleX() * root.width());
					}
					var newY = root.y();
					if(root.y() > 0 || root.scaleY() * root.height() < stage.height()){
						newY = 0 ;
					}else if(newY < stage.height() - (root.scaleY() * root.height())){
						newY = stage.height() - (root.scaleY() * root.height());
					}
					root.x(newX);
					root.y(newY);
					layer.draw();
				}
			});
			
		}
	};
});


app.directive('editorMap', ['socket',function(socket) {
	return {
		restrict:'A',
		scope:{data:'=',backup:'@'},
		templateUrl: 'editor/templates/edt-map.html',
		controller:function($scope){
			$scope.focus={};
			$scope.toggledLayers=[];
			$scope.$watch('data', 
				function(newVals, oldVals) {
					if (!newVals) return;
					for(var i in $scope.data.layers){
						$scope.toggledLayers[i]=true;
					}
					console.time("view");
					$scope.view = $scope.data.getView($scope.toggledLayers);
					console.timeEnd("view");
					return ;
				}, true);
			$scope.toggleLayer=function(i){
				$scope.toggledLayers[i]=!$scope.toggledLayers[i];
				$scope.view = $scope.data.getView($scope.toggledLayers);
			};
			$scope.isLayerToggled=function(i){
				return $scope.toggledLayers[i];
			};
			$scope.selectLayer=function(i){
				
			};
			
			$scope.remMap=function(){
				socket.emit('remMap',$scope.data._id);
				$scope.data={};
				$scope.focus={};
			};
			socket.on('maj', function (data) {
				$scope.data=data;
				$scope.focus=data[0];
				console.log("Done");
			});
			$scope.resetfocusValues = function(){
				console.log($scope.focus);
			};
		},
		controllerAs:"map"
	};
}]);
})();
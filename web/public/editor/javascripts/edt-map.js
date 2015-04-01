"use strict";
(function(){
var app = angular.module('app')

app.directive('drawareaCanvas',function(){
	return{
		restrict : 'E',
		controller:function($scope,$element){
			var layers=[];
			$scope.$watchCollection('view', 
				function(newVals, oldVals) {
					if (!newVals) return;
					var stage = initStage(newVals);
					console.time("initiateData");
					for(var i = 0, len = newVals.layers.length ; i < len;i++){
						var kLayer = initLayer(stage,newVals.layers[i]);						
						$scope.$watch('newVals.layers[i]', function(newVals, oldVals) {
							if (!newVals) return;
							updateLayer(kLayer,newVals);
							return ;
						}, true);
					}
					initForegrid(stage,newVals);
					console.timeEnd("initiateData");
					return ;
				}, true);
			var rootElement= $($element[0]); 
			function getRootWidth(){return rootElement.width();}
			function getRootHeight(){return rootElement.height();}
			
			$scope.$watch('toggledLayers', function(newVals, oldVals) {
				if (!newVals) return;
				for(var i=0;i<newVals.length;i++){
					if(layers[i]!=undefined){
						layers[i].visible(newVals[i]);
						layers[i].draw();
					}
				}
				return ;
			}, true);
			function initStage(option){
				console.time("initStage");
				var stage = new Konva.Stage({
					container: $element[0],
					width: getRootWidth(),
					height: getRootHeight(),
					scaleX:getRootWidth()/option.width,
					scaleY:getRootWidth()/option.width,
					draggable: true,
					dragBoundFunc: function(pos) {
						var newX = pos.x;
						var newY = pos.y;
						if(pos.x > 0 || this.width() > (this.scaleX() * option.width)){
							newX = 0 ;
						}else if(pos.x < this.width() - (this.scaleX() * option.width)){
							newX = this.width() - (this.scaleX() * option.width);
						}
						if(pos.y > 0 || this.height() > (this.scaleY() * option.height)){
							newY = 0 ;
						}else if(pos.y < this.height() - (this.scaleY() * option.height)){
							newY = this.height() - (this.scaleY() * option.height);
						}
						return {
							x: newX,
							y: newY
						};
					}
				});
				stage.on('mousewheel', function(e) {
					var zoomAmount = (e.evt.wheelDelta/120)*0.01;
					if((stage.scaleX()+zoomAmount)>(this.width()/option.width) && (stage.scaleX()+zoomAmount)<2){
						stage.scaleX(stage.scaleX()+zoomAmount);
						stage.scaleY(stage.scaleY()+zoomAmount);
						var newX = stage.x();
						if(stage.x() > 0 || stage.scaleX()*stage.width() < stage.width()){
							newX = 0 ;
						}else if(newX < stage.width() - (stage.scaleX() * stage.width())){
							newX = stage.width() - (stage.scaleX() * stage.width());
						}
						var newY = stage.y();
						if(stage.y() > 0 || stage.scaleY() * stage.height() < stage.height()){
							newY = 0 ;
						}else if(newY < stage.height() - (stage.scaleY() * stage.height())){
							newY = stage.height() - (stage.scaleY() * stage.height());
						}
						stage.x(newX);
						stage.y(newY);
						stage.draw();
					}
				});
				console.timeEnd("initStage");
				return stage;
			}
			var focused;
			
			// generate hexes
			function initLayer(stage,layer){
				console.time("initLayer "+layer.type);
				var kLayer = new Konva.Layer();
				updateLayer(kLayer,layer);
				stage.add(kLayer);
				kLayer.draw();
				layers.push(kLayer);
				console.timeEnd("initLayer "+layer.type);
				return kLayer;
			};
			
			function updateLayer(kLayer,layer){
				kLayer.destroyChildren();
				switch(layer.type){
					case 'base':{
						for(var p in layer.points){
							var curr = layer.points[p];
							var poly=new Konva.RegularPolygon({
								id: p,
								x: curr.x,
								y: curr.y,
								sides: 6,
								stroke:'black',
								strokeWidth:0.2,
								radius: curr.radius,
								fill : curr.fill
							});
							kLayer.add(poly);
						}
						break;
					};
					case 'terrain':{
						for(var p in layer.points){
							var curr = layer.points[p];
							kLayer.add(new Konva.Image({
								width: curr.size,
								height: curr.size,
								id: p,
								x: curr.x,
								y: curr.y,
								image : curr.fill
							}));
						}
						break;
					};
					case 'border':{
						for(var p in layer.points){
							var curr = layer.points[p];
							kLayer.add(new Konva.Line({
								id: p,
								points:[curr.a_x,curr.a_y,curr.b_x,curr.b_y],
								stroke: curr.fill,
								strokeWidth: 2,
							}));
						}
						break;
					};
					case 'building':{
						for(var p in layer.points){
							var curr = layer.points[p];
							kLayer.add(new Konva.RegularPolygon({
								id: p,
								x: curr.x,
								y: curr.y,
								sides: 6,
								radius: curr.radius,
								fillPatternImage: curr.fill
							}));
						}
						break;
					};
				};
				
				kLayer.cache({
					width: layer.width,
					height: layer.height
				});
			}
			
			function initForegrid(stage,values){
				var kLayer = new Konva.Layer();
				for(var q = -1; q < (values.hWidth)*2+1; q++){
					for(var r = -1- Math.floor(q/2); r < (values.hHeight*3/2)- Math.floor(q/2); r++){
						
						var poly = new Konva.RegularPolygon({
							id: q+":"+r,
							x: values.RADIUS + values.RADIUS/SQRT3 * 3/2* q,
							y: values.RADIUS + values.RADIUS *(r+q/2),
							sides: 6,
							radius: 5,
							opacity:0.2,
							fill: 'grey'
						});
						if(((q-r)/3)%1 == 0 && ((q+2*r)/3)%1 == 0){
							poly.radius(values.RADIUS-5);
						}
						kLayer.add(poly);
					}
				}
				kLayer.on('mouseover', function(evt) {
					var target = evt.target;
					var coord=evt.target.id().split(':');
					var Q = parseInt(coord[0]);
					var R = parseInt(coord[1]);
					if(((Q-R)/3)%1 == 0 && ((Q+2*R)/3)%1 == 0){
						var result = Hexmap.getHexInRange({q:(Q-R)/3,r:(Q+2*R)/3},5,{});
						for(var i=0,len=result.length; i<len; i++){
							var rh=stage.findOne('#'+(2*result[i].q+result[i].r)+":"+(-result[i].q+result[i].r));
							if(rh!=undefined){
								rh.opacity(0.5);
								rh.draw();
							}
						}
					}
				});
				kLayer.on('mouseout', function(evt) {
					var target = evt.target;
					kLayer.draw();
				});
				
				
				kLayer.cache({
					width: values.width,
					height: values.height
				});
				stage.add(kLayer);
				kLayer.draw();
			}
		}
	};
});

app.directive('editorMap', ['socket',function(socket) {
	return {
		restrict:'E',
		templateUrl: 'templates/edt-map.html',
		controller:function($scope,$routeParams,$location){
			var option={RADIUS:30};
			if($routeParams.id != -1){
				socket.once('resMapData',function(data){
					$scope.data=data;
				});
				socket.emit('getMapData',$routeParams.id);
			}else{
				var map = new Hexmap.Map({width:30,height:30});
				map.DummyMap();
				$scope.data ={
					name : "name",
					map : map
				};
			}
			$scope.focused={};
			$scope.toggledLayers=[true,true,true,true];
			$scope.selectedLayer=0;
			$scope.toggleLayer=function(i){
				$scope.toggledLayers[i]=!$scope.toggledLayers[i];
			};
			$scope.isLayerToggled=function(i){
				return $scope.toggledLayers[i];
			};
			$scope.selectLayer=function(i){
				$scope.selectedLayer = i;
			};
			$scope.modifyLayer=function(d){
				$scope.data.map.layers[d.i].fill(d);
				console.log(d);
			};
			$scope.wipeLayer=function(i){
				$scope.data.map.wipeLayerLayer(i);
			};
			$scope.save=function(){
				socket.emit('save_map',$scope.data);
				if($routeParams.id == -1){
					socket.once('resMapData',function(data){
						$location.path('/map/'+data._id);
					});
				}
			}
			$scope.$watchCollection('data.map', 
				function(newVals, oldVals) {
					if (!newVals) return;
					$scope.view = Hexmap.getView(newVals, option, Hexmap.defaultConfig);
					return ;
				}, true);
		},
		controllerAs:"map"
	};
}]);
})();
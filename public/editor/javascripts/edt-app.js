(function(){
var app = angular.module('editor-app',['ui.bootstrap','editor-map','editor-character'])


app.directive('editorAppSide', ['socket',function(socket) {
	return {
		restrict:'A',
		scope:true,
		templateUrl: 'editor/templates/edt-app-side.html',
		controller:function($scope,$modal){
			$scope.addNewMap=function(){
				var modalInstance = $modal.open({
					templateUrl: 'editor/templates/edt-map-mod.html',
					controller: function ($scope, $modalInstance) {
						$scope.mwidth=100;
						$scope.mheight=100;
						$scope.ok = function () {
							var data = {
								width:$scope.mwidth,
								height:$scope.mheight
							}
							$modalInstance.close(data);
						};

						$scope.cancel = function () {
							$modalInstance.dismiss('cancel');
						};
					},
					size: 'md'
				});
				modalInstance.result.then(
					function (data) {
						var m = new Hexmap.Map(data);
						m.addLayer();
						m.layers[1].fill({h:1});
						m.addLayer(new Hexmap.Layer({q:50,r:50,width:20,height:20}));
						m.layers[2].fill({seed:1});
						m.addLayer();
						m.layers[3].fill({seed:3});
						$scope.map.data = m;
						$scope.map.backup = m;
						$scope.setTab(1);
					}, 
					function () {}
				);
			};
			
			$scope.addNewChar=function(){
				$scope.waitForAnswer();
				socket.emit('addNewChar');
			};
			$scope.selectMap=function(index){
				$scope.waitForAnswer();
				socket.emit('getMapData',$scope.map.list[index]._id);
			};
			$scope.selectChar=function(id){
				$scope.waitForAnswer();
				socket.emit('getCharData',id);
			};
		}
	};
}]);

app.directive('editorApp', ['socket',function(socket) {
	return {
		restrict:'A',
		templateUrl: 'editor/templates/edt-app.html',
		controller:function($scope,$modal){
			$scope.map={};
			$scope.map.list=[];
			$scope.chars={};
			$scope.chars.list=[];
			
			var tab=1;
			$scope.isSet = function(checkTab) {
				return tab === checkTab;
			};
			$scope.setTab = function(activeTab) {
				tab = activeTab;
			};
			var awaitedAnswer = 0;
			var modalInstance; 
			$scope.waitForAnswer = function(){
				if(!awaitedAnswer){
					awaitedAnswer++;
					modalInstance = $modal.open({
						templateUrl: 'editor/templates/edt-wait-mod.html',
						controller: function ($scope, $modalInstance) {},
						size: 'md'
					});
				}else{
					awaitedAnswer++;
				}
			};
			
			var answered = function(){
				if(awaitedAnswer){
					awaitedAnswer--;
					if(!awaitedAnswer){
						modalInstance.dismiss();
					}
				}
			}
			
			socket.on('resMapData',function(data){
				$scope.setTab(1);
				$scope.map.data=data;
				$scope.map.backup=data;
				answered();
			});
			
			socket.on('resMapList',function(data){
				$scope.setTab(0);
				$scope.map.list=data;
				answered();
			});
			socket.on('resCharData',function(data){
				$scope.chars.data=data;
				$scope.setTab(2);
				answered();
			});
			socket.on('resCharList',function(data){
				$scope.chars.list=data;
				$scope.setTab(0);
				answered();
			});
			$scope.waitForAnswer();
			socket.emit('getMapList');
			$scope.waitForAnswer();
			socket.emit('getCharList');
		}
	};
}]);
})();
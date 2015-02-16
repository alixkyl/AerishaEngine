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
						$scope.seed=0;
						$scope.patchSize=10;
						$scope.landSea=0.1;
						$scope.degree=3;
						$scope.mwidth=100;
						$scope.mheight=100;
						$scope.noise=0.1;
						$scope.ok = function () {
							var data={
								seed:$scope.seed,
								patchSize:$scope.patchSize,
								landSea:$scope.landSea,
								degree:$scope.degree,
								width:$scope.mwidth,
								height:$scope.mheight,
								noiseImpact:$scope.noise
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
						$scope.waitForAnswer();
						socket.emit('addNewMap',data);
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
			
			var tab=0;
			$scope.isSet = function(checkTab) {
				return tab === checkTab;
			};
			var setTab = function(activeTab) {
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
				setTab(1);
				$scope.map.data=data;
				$scope.map.backup=data;
				answered();
			});
			
			socket.on('resMapList',function(data){
				setTab(0);
				$scope.map.list=data;
				answered();
			});
			socket.on('resCharData',function(data){
				$scope.chars.data=data;
				setTab(2);
				answered();
			});
			socket.on('resCharList',function(data){
				$scope.chars.list=data;
				setTab(0);
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
(function(){
var app = angular.module('editor-directives',['ui.bootstrap','editor-map','editor-charater-sheet'])


app.directive('editorSideBar', ['socket',function(socket) {
	return {
		restrict:'A',
		scope:true,
		templateUrl: 'editor/templates/edt-side-bar.html',
		controller:function($scope,$modal){
			$scope.addNewMap=function(){
				var modalInstance = $modal.open({
					templateUrl: 'editor/templates/edt-mod.html',
					controller: function ($scope, $modalInstance) {
						$scope.ok = function () {
							var data={
								seed:$scope.seed,
								size:$scope.size
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
						socket.emit('addNewMap',data);
					}, 
					function () {
						$log.info('Modal dismissed at: ' + new Date());
					}
					);
			};
			
			$scope.addNewChar=function(){
				socket.emit('addNewChar');
			};
			$scope.selectMap=function(id){
				socket.emit('getMapData',id);
			};
			$scope.selectChar=function(id){
				socket.emit('getCharData',id);
			};
		}
	};
}]);

app.directive('edtMapPopup', function() {
	return {
		restrict:'A',
		scope:true,
		templateUrl: 'editor/templates/edt-map-popup.html',
		controller:function($scope){
			
			
			
		}
	};
});

app.directive('editorApp', ['socket',function(socket) {
	return {
		restrict:'A',
		templateUrl: 'editor/templates/edt-app.html',
		controller:function($scope){
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
			
			
			
			socket.on('resMapData',function(data){
				$scope.map.data=data;
				setTab(1);
			});
			
			socket.on('resMapList',function(data){
				$scope.map.list=data;
				setTab(0);
			});
			socket.on('resCharData',function(data){
				$scope.chars.data=data;
				setTab(2);
			});
			socket.on('resCharList',function(data){
				$scope.chars.list=data;
				setTab(0);
			});
			socket.emit('getMapList');
			socket.emit('getCharList');
		}
	};
}]);
})();
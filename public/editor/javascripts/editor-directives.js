(function(){
var app = angular.module('editor-directives',['editor-map','editor-charater-sheet'])


app.directive('editorSideBar', function() {
	return {
		restrict:'E',
		scope:true,
		templateUrl: 'editor/edt-side-bar.html',
		controller:function(){
			
		}
	};
});

app.directive('editorApp', ['socket',function(socket) {
	return {
		restrict:'A',
		templateUrl: 'editor/edt-app.html',
		controller:function($scope){
			$scope.map={};
			$scope.map.list=[];
			$scope.chars={};
			$scope.chars.list=[];
			
			var tab=1;
			$scope.isSet = function(checkTab) {
				return tab === checkTab;
			};
			var setTab = function(activeTab) {
				tab = activeTab;
			};
			
			$scope.selectMap=function(id){
				console.log(id)
				socket.emit('getMapData',id);
				setTab(1);
			};
			
			$scope.selectChar=function(id){
				console.log(id)
				socket.emit('getCharData',id);
				setTab(2);
			};
			
			socket.on('resMapData',function(data){
				$scope.map.data=data;
			});
			
			socket.on('resMapList',function(data){
				$scope.map.list=data;
				console.log(data);
			});
			socket.on('resCharData',function(data){
				$scope.chars.data=data;
			});
			socket.on('resCharList',function(data){
				$scope.chars.list=data;
				console.log(data);
			});
			socket.emit('getMapList');
			socket.emit('getCharList');
		}
	};
}]);
})();
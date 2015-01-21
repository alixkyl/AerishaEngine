(function(){
var app = angular.module('editor-map',['editor-infobox','editor-drawarea'])


app.directive('editorMap', ['socket',function(socket) {
	return {
		restrict:'E',
		scope:{},
		templateUrl: 'editor/editor-map.html',
		controller:function($scope){
			$scope.data = new Array();
			$scope.focus={};
			socket.on('maj', function (data) {
				$scope.data=data;
				$scope.focus=data[0];
				console.log("Done");
			});
			$scope.refresh=function(){
				socket.emit('getMapData');
			};
		},
		controllerAs:"map"
	};
}]);
})();
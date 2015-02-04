(function(){
var app = angular.module('editor-chracter',['editor-charater-sheet']);


app.directive('editorCharacter', ['socket',function(socket) {
	return {
		restrict:'E',
		scope:{},
		templateUrl: 'editor/templates/edt-character.html',
		controller:function($scope){
			$scope.data = new Array();
			$scope.focus={};
			socket.on('characterData', function (data) {
				$scope.data=data;
				$scope.focus=data[0];
				console.log(data);
			});
			$scope.refresh=function(){
				socket.emit('getCharacterData');
			};
		},
		controllerAs:"chara"
	};
}]);
})();
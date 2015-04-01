(function(){
var app = angular.module('editor-character',[]);

app.directive('ecsRange', [function() {
	return {
		restrict:'A',
		scope:{name:'@name',value:'=',maximum:'@max'},
		template: '<label>{{name}}:</label><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="value" aria-valuemin="0" aria-valuemax="maximum" style="width: {{value*100/maximum}}%;"> </div></div>',
		controller:function($scope){
			$scope.getTimes=function(n){
				return new Array(Number(n));
			};
		}
	};
}]);

app.directive('ecsValue', [function() {
	return {
		restrict:'A',
		scope:{name:'@name',value:'='},
		template: '<label>{{name}}:</label><label>{{value}}</label>',
		controller:function($scope){
			$scope.getTimes=function(n){
				return new Array(n);
			};
		}
	};
}]);

app.directive('ecsAttributs', [function() {
	return {
		restrict:'A',
		scope:{name:'@name',value:'='},
		template: '<label>{{name}}:</label><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="value" aria-valuemin="0" aria-valuemax="5" style="width: {{value*100/5}}%;"> </div></div>',
		controller:function($scope){
			$scope.getTimes=function(n){
				return new Array(n);
			};
		}
	};
}]);
app.directive('editorCharacterSheet', [function() {
	return {
		scope:{focus:'='},
		require:['^ecsAttribut','ecsValue','ecsRange'],
		restrict:'E',
		templateUrl: 'templates/edt-char.html'
	};
}]);

app.directive('editorCharacter', ['socket',function(socket) {
	return {
		restrict:'E',
		scope:{},
		templateUrl: 'templates/edt-character.html',
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
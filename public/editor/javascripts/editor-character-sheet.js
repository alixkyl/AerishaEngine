(function(){
var app = angular.module('editor-charater-sheet',[]);

app.directive('ecsRange', [function() {
	return {
		restrict:'E',
		scope:{name:'@name',value:'=',maximum:'@max'},
		templateUrl: 'editor/templates/edt-char-range.html',
		controller:function($scope){
			$scope.getTimes=function(n){
				return new Array(Number(n));
			};
		}
	};
}]);

app.directive('ecsValue', [function() {
	return {
		restrict:'E',
		scope:{name:'@name',value:'='},
		templateUrl: 'editor/templates/edt-char-val.html',
		controller:function($scope){
			$scope.getTimes=function(n){
				return new Array(n);
			};
		}
	};
}]);

app.directive('ecsAttributs', [function() {
	return {
		restrict:'E',
		scope:{name:'@name',value:'='},
		templateUrl: 'editor/templates/edt-char-attr.html',
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
		templateUrl: 'editor/templates/edt-char.html'
	};
}]);
})();
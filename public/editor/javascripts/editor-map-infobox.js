(function(){
var app = angular.module('editor-infobox',[]);


app.directive('infobox', function() {
	return {
		restrict:'E',
		scope:{focus:'='},
		templateUrl: 'editor/editor-map-infobox.html'
	};
});

})();
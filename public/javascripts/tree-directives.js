(function(){
var app = angular.module('tree',[])
 

 
app.controller('tabs-controller', function() {
	this.tab=1;
	this.isSet = function(checkTab) {
		return this.tab === checkTab;
	};
	this.setTab = function(activeTab) {
		this.tab = activeTab;
	};
});

app.directive('editorSideBar', function() {
	return {
		restrict:'E',
		templateUrl: 'editor/edt-side-bar.html'
	};
});

})();
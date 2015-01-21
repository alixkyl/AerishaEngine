(function(){
var app = angular.module('editor-directives',['editor-map','editor-chracter'])
 
app.factory('socket', function () {
  var socket = io.connect('/editor');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $scope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $scope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
 
app.controller('tabs-controller', function() {
	this.tab=1;
	this.isSet = function(checkTab) {
		return this.tab === checkTab;
	};
	this.setTab = function(activeTab) {
		this.tab = activeTab;
	};
});

app.directive('editorApp', function() {
	return {
		restrict:'E',
		templateUrl: 'editor/editor-app.html'
	};
});
})();
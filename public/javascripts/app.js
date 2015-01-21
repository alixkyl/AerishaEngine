(function(){
var app = angular.module('app',['editor-directives'])
 
app.factory('socket', function ($rootScope) {
  var socket = io.connect('/editor');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
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
})();
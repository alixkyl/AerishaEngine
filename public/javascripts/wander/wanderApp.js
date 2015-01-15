angular.module('wanderApp',[])
 
.factory('socket', function ($rootScope) {
  var socket = io.connect('/wander');
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
})
 
.controller('AppCtrl', function($scope,socket) {
  socket.on('firstMaj', function (data) {
    $scope.data=data;
    $scope.focus=data["0_0"];
    createContext($scope,data,socket);
  });
  socket.on('maj', function (data) {
    $scope.data=data;
    $scope.focus=data["0_0"];
    draw(drawConfig,data);
  });
  socket.emit('update',{r:0,q:0});
})

.directive('infobx', function() {
  return {
    templateUrl: 'javascripts/wander/infoBx.html'
  };
});
var drawConfig = {};
function createContext($scope,data,socket){

var margin = {top: 0, right: 0, bottom: 0, left: 0};
	
	drawConfig.radius = 40;
	drawConfig.offsetWidth = ($('#drawArea').width()/2);
	drawConfig.offsetHeight = ($('#drawArea').height()/2);
	
	document.oncontextmenu = function() {
		return false;
	};
	
	var zoom = d3.behavior.zoom();
	
	$('document').dblclick(function (e) {
		e.preventDefault();
	}); 
	var svg = d3.select("#drawArea").append("svg")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.right + ")")
		.call(zoom);
	var rect = svg.append("rect")
    .attr("width", $('#drawArea').width())
    .attr("height", $('#drawArea').height())
    .style("fill", "black")
    .style("pointer-events", "all");
	
	drawConfig.g = svg.append("g");
	var elFocus;
    
	drawConfig.onclick=function(data){
		socket.emit('move',data);
	};
	
	draw(drawConfig,data);
}
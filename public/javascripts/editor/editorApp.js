angular.module('editorApp',[])
 
.factory('socket', function ($rootScope) {
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
})
 
.controller('AppCtrl', function($scope,socket) {
  socket.on('maj', function (data) {
    $scope.data=data;
    $scope.focus=data["0_0"];
    createContext($scope,data);
  });
  socket.emit('move',{r:0,q:0});
})

.directive('infobx', function() {
  return {
    templateUrl: 'javascripts/editor/infoBx.html'
  };
});

function createContext($scope,data){

var margin = {top: 0, right: 0, bottom: 0, left: 0};
	var drawConfig = {};
	drawConfig.radius = 5;
	drawConfig.offsetWidth = 10;
	drawConfig.offsetHeight = 10;
	
	document.oncontextmenu = function() {
		return false;
	};
	
	var zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);
	
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
    
	drawConfig.onclick=function(data,hex){
		if(elFocus){
			elFocus.style('stroke', 'none');
			elFocus.style('stroke-width', '0px');
		}
		elFocus = d3.select(d3.event.target);
		elFocus.style('stroke', '#F00');
		elFocus.style('stroke-width', '1px');
		$scope.focus=data;
        $scope.$apply();
	};
	
	draw(drawConfig,data);
	
	function zoomed() {
	  drawConfig.g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	};
}
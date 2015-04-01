"use strict";
(function(){
var app = angular.module('app',['ui.bootstrap','ngRoute'])

app.factory('socket', function ($rootScope) {
	console.log("io.connect('/editor')");
  var socket = io.connect('/editor');
  return {
	once: function (eventName, callback) {
      socket.once(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
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

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/map/:id', {
        template: '<editor-map ></editor-map>'
      }).
      when('/character/:id', {
        templateUrl: '<div editor-char></div>'
      }).
	  when('/universe/:id', {
        templateUrl: '<div editor-universe></div>'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
app.directive('editorMenu', ['socket',function(socket) {
	return {
		restrict:'A',
		controller:function($scope,$route,$modal,$location){

			var awaitedAnswer = 0;
			var modalInstance; 
			$scope.waitForAnswer = function(){
				if(!awaitedAnswer){
					awaitedAnswer++;
					modalInstance = $modal.open({
						templateUrl: 'templates/edt-wait-mod.html',
						controller: function ($scope, $modalInstance) {},
						size: 'lg'
					});
				}else{
					awaitedAnswer++;
				}
			};
			$scope.open=function(type){
				var modalInstance = $modal.open({
					templateUrl: 'templates/edt-open-modal.html',
					controller: function ($scope, $modalInstance) {
						$scope.list=[];
						$scope.selected=-1;
						$scope.select=function(i){
							$scope.selected=i;
						}
						$scope.isSelected=function(i){
							return $scope.selected==i;
						}
						$scope.deleteMap=function(index){
							socket.emit('delete_map',$scope.list[index]._id);
							$scope.list.splice(index, 1);
						};
						switch(type){
							case 'map':{
								socket.once('resMapList',function(data){
									$scope.list=data;
								});
								socket.emit('getMapList');
								break;
							};
							case 'character':{
								socket.once('resCharList',function(data){
									$scope.list=data;
								});
								socket.emit('getCharList');
								break;
							};
							case 'universe':{
								
								break;
							};
						};
						
						$scope.ok = function () {
							if($scope.selected!=-1)
								$modalInstance.close($scope.list[$scope.selected]);
						};

						$scope.cancel = function () {
							$modalInstance.dismiss('cancel');
						};
					},
					size: 'md'
				});
				modalInstance.result.then(
					function (data) {
						switch(type){
							case 'map':{
								$location.path('/map/'+data._id);
								break;
							};
							case 'character':{
								$location.path('/character/'+data._id);
								break;
							};
							case 'universe':{
								$location.path('/universe/'+data._id);
								break;
							};
						};
					}, 
					function () {}
				);
			};
			$scope.create=function(type){
				switch(type){
					case 'map':{
						$location.path('/map/-1');
						break;
					};
					case 'character':{
						$location.path('/character/-1');
						break;
					};
					case 'universe':{
						$location.path('/universe/-1');
						break;
					};
				};
			};
			$scope.save=function(){
				if($route.current.scope.save!=undefined){
					$route.current.scope.save();
				}
			}
			var answered = function(){
				if(awaitedAnswer){
					awaitedAnswer--;
					if(!awaitedAnswer){
						modalInstance.dismiss();
					}
				}
			}
		}
	};
}]);
})();
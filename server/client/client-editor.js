module.exports=function(id,socket,handler){
	
	socket.on('getMapList',function (data) {
		handler.getMapList(function(data){
			socket.emit('resMapList', data);
		});
	});
	
	socket.on('getMapData',function (id) {
		handler.getMapDataOf(id,function(data){
			socket.emit('resMapData', data);
		});
	});
	
	socket.on('getCharList',function (data) {
		handler.getCharList(function(data){
			socket.emit('resCharList', data);
		});
	});
	
	socket.on('getCharData',function (id) {
		handler.getCharDataOf(id,function(data){
			socket.emit('resCharData', data);
		});
	});
	
	socket.on('addNewMap',function (data) {
		handler.addNewMap(data,function(data){
			socket.emit('resMapList', data);
		});
	});
	
	socket.on('remMap',function (id) {
		handler.remMap(id,function(data){
			socket.emit('resMapList', data);
		});
	});
};
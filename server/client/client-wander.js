module.exports=function(id,socket,handler){
	socket.on('update',function (data) {
		socket.emit('firstMaj',  handler.getView(id,3) );
	});
	
	socket.on('move',function (data) {
		handler.moveClient(id, data);
		socket.emit('maj',  handler.getView(id,3) );
	});

};
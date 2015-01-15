module.exports=function(id,socket,handler){
	
	socket.on('update',function (data) {
		socket.emit('maj',  handler.getViewEditor(id,30) );
	});
	
	socket.on('move',function (data) {
		socket.emit('maj',  handler.getMap() );
	});
	
	socket.on('ApplyModification',function (data) {
		handler.ApplyModificationEditor(data);
	});
};
module.exports=function(id,socket,handler){
	
	socket.on('update',function (data) {
		socket.emit('maj',  handler.getViewEditor(id,30) );
	});
	
	socket.on('getMapData',function (data) {
		socket.emit('maj',  handler.getMap() );
	});
	
	socket.on('getCharacterData',function (data) {
		var data=handler.getChaData();
		console.log(data);
		socket.emit('characterData', data );
	});
	
	socket.on('ApplyModification',function (data) {
		handler.ApplyModificationEditor(data);
	});
};
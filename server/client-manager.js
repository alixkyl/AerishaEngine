var clientWander=require('./client/client-wander.js');
var clientEditor=require('./client/client-editor.js');

module.exports=new function(){
	
	var clients={};
	this.start=function(io,handler){
		io.of('/wander').on('connection', function (socket) {
			var id = handler.newClient();
			clients[id]=new clientWander(id, socket, handler);
		});
		io.of('/editor').on('connection', function (socket) {
			var id = handler.newClient();
			clients[id]=new clientEditor(id, socket, handler);
		});
	};

}
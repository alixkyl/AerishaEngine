module.exports=new function(){
	var clientManager=require('./client-manager.js');
	var dataManager=require('./data-manager.js');
	var handler=require('./handler.js')(dataManager, clientManager);
	
	this.start = function(io){
		dataManager.start(handler);
		clientManager.start(io,handler);
		return this;
	}
};
module.exports=new function(){
	var clientManager=require('./clientManager.js');
	var dataManager=require('./dataManager.js');
	var handler=require('./handler.js')(dataManager, clientManager);
	
	this.start = function(io){
		dataManager.start(handler);
		clientManager.start(io,handler);
		return this;
	}
};
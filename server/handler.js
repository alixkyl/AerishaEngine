module.exports=function(dataManager, clientManager){
	var Iid=0;
	var clients={};
	
	this.newClient = function(){
		clients[Iid]={};
		clients[Iid].coord={q:0,r:0}
		return Iid++;
	}
	
	this.moveClient = function(id,data){
		console.log("move "+data.r+" "+data.q)
		clients[id].coord.r += data.r/1;
		clients[id].coord.q += data.q/1;
	}
  
	this.getMap = function(){
		return dataManager.getMapData();
	}
  
	this.ApplyModificationEditor=function(data){
		dataManager.ApplyModificationEditor(data);
	
	}
  
	this.getView = function(id,N){
		delta=clients[id].coord;
		localData={};
		for(r=-N;r<=N;r++)
		{
			for(q=Math.max(-N, -r-N);q<=Math.min(N, -r+N);q++)
			{
				if(dataManager.getMapDataOf((r+delta.r)+"_"+(q+delta.q))==undefined)
					continue;
				var tmp=dataManager.getMapDataOf((r+delta.r)+"_"+(q+delta.q));
				localData[r+"_"+q]={_id:tmp._id, name: tmp.name, r:r,q:q,height:tmp.height,moist:tmp.moist }
			}
		}
		return localData;
	}
	return this;
};
Math.range=function(begin,end,step){
	var res=[];
	for(var i = 0;begin+(step*i)<=end;i++){res[i]=begin+(step*i);}
	return res;
}
			
Math.clamp = function(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

var SQRT3 = Math.sqrt(3);
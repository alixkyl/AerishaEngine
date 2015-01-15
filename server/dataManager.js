var mongoose = require('mongoose');

module.exports=new function(){
	var mapData={};

	this.start=function(handler){
		// mapData=require('./data/plop.json');
        mongoose.connect('mongodb://localhost:27017/test');
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function (callback) {
            console.log('----');
            var hexSchema = mongoose.Schema({
                name: String,
                q: Number,
                r: Number,
                height: Number,
                moist: Number
            })
            var Hex = mongoose.model('Hex', hexSchema)
            // for(var i in mapData){
                // var hex = new Hex({
                // name: mapData[i].name,
                // q: mapData[i].q,
                // r: mapData[i].r,
                // height: mapData[i].height,
                // moist: mapData[i].moist
            // });
                // hex.save(function (err, hex) {
                  // if (err) return console.error(err);
                  // console.log(hex);
                // });
            // }
            Hex.find(function (err, kittens) {
                if (err) return console.error(err);
                
                for(var i = 0; i < kittens.length; i++){
                    mapData[kittens[i].q+"_"+kittens[i].r] = kittens[i];
                }
            })
        });
	}
  
  this.getMapData = function(){
		return mapData;
	
	}
	
	this.getMapDataOf = function(id){
		return mapData[id];
	
	}
	
};
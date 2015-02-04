var mongoose = require('mongoose');
var mapGenerator = require('HexMapGenerator');
var schemas = require('./data-schema.js');

function random (low, high) {
    return Math.round(Math.random() * (high - low) + low);
}

var dummyChar= function(i){
	var dummy={
		attributs:{
		physic:{
			strength:random(1,5),
			dexterity:random(1,5),
			stamina:random(1,5)
		},
		social:{
			charisma:random(1,5),
			empathy:random(1,5),
			will:random(1,5)
		},
		mental:{
			logic:random(1,5),
			ingeniosity:random(1,5),
			abstraction:random(1,5)
		}
	},
	skills : {
		combat:{
			offensive:random(1,5),
			defensive:random(1,5),
			subversive:random(1,5)
		},
		move:{
			athletism:random(1,5),
			acrobatics:random(1,5),
			stealth:random(1,5)
		},
		social:{
			presence:random(1,5),
			bargain:random(1,5),
			subterfuge:random(1,5)
		},
		empirism:{
			engineering:random(1,5),
			nature:random(1,5),
			crafts:random(1,5)
		},
		knowledge:{
			mysticism:random(1,5),
			civilization:random(1,5),
			science:random(1,5)
		},
		gift:{
			power:random(1,5),
			weaving:random(1,5),
			influence:random(1,5)
		}
	},
	status : {
		endurance:{
			breath : random(1,10),
			recorvery : random(1,10),
			exhaustion : random(1,20)
		},
		health:{
			vitality : random(1,10),
			regeneration : random(1,10),
			wounds : {
				superficial : { threshold:random(1,20), level:random(1,10)},
				minor : { threshold:random(1,40), level:random(1,8)},
				deep : { threshold : random(1,60),level:random(1,6)},
				serious : { threshold : random(1,80),level:random(1,3)},
				fatal : { threshold : random(1,100),level:random(1,1)},
			}
		},
		psych:{
			moral : random(1,5),
			adrenaline : random(1,5),
			serenity : random(1,5)
		}
	}
	}
	dummy.playerId="player "+i;
	return dummy;
}

module.exports=new function(){
	var mapData=new Array();

	this.start=function(handler){
        mongoose.connect('mongodb://localhost:27017/test');
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function (callback) {
            console.log('----');
           /** 
			for(var i=0; i<10; i++){
				var c={};
				var chara = new schemas.Character(dummyChar(i));
                chara.save(function (err, chara) {
                  if (err) return console.error(err);
                  console.log(chara);
                });
            }
			*/
        });
	}
  
	this.getMapList = function(callback){
		schemas.Map.find({},'_id',function (err, data) {
			if (err) return console.error(err);
			callback(data);
		});
	};
	
	this.getMapDataOf = function(id, callback){
		schemas.Map.findById(id,function (err, data) {
			if (err) return console.error(err);
			callback(data);
		});
	};
	
	this.getCharList = function(callback){
		schemas.Character.find({},'_id',function (err, data) {
			if (err) return console.error(err);
			callback(data);
		});
	};
	
	this.getCharDataOf = function(id, callback){
		schemas.Character.findById(id,function (err, data) {
			if (err) return console.error(err);
			callback(data);
		});
	};
	
	this.addNewMap = function(dataG, callback){
		var map = new schemas.Map({
			name:dataG.size+","+dataG.seed+",25,0.05",
			hexs:mapGenerator.generateMap(dataG.size,dataG.seed,25,0.05)
		});
		
		map.save(function (err) {
			if (err) return console.error(err);
			getMapList(callback);
		});
	};
	
	this.remMap = function(id, callback){
		schemas.Map.findById(id,function (err, data) {
			if (err) return console.error(err);
			data.remove(function(err){
				if (err) return console.error(err);
				getMapList(callback);
			});
		});
	};
};
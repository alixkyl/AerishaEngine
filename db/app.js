var nconf = require('nconf');
nconf.file({ file: 'config.json'});
var redis 			= require("redis")
	, client_pub 	= redis.createClient({host: nconf.get('REDIS:host'), port: nconf.get('REDIS:port')})
	, client_sub 	= redis.createClient({host: nconf.get('REDIS:host'), port: nconf.get('REDIS:port')})
	, mongoose 		= require('mongoose')
	, schemas 		= require('./data-schema.js');

mongoose.connect(nconf.get('MONGOD:url') );
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		client_sub.psubscribe('DB:*');
	});
	
function buildCallback(s){
	return function (err, data) {
			if (err){
				client_pub.publish(s, JSON.stringify({err:'fail',data:err}));
			}else{
				client_pub.publish(s, JSON.stringify({data:data}));
			};
		};
};

client_sub.on('pmessage', function (pattern, channel, message) {
	console.log('pmessage', channel);
	// TO:FROM:RESPONSEID:FUNC:OPTIONS
	var param = channel.split(':');
	var from 	= param[1]
	  ,  rID	= param[2]
	  , func	= param[3];
	var d = JSON.parse(message);
	switch(func){
		case 'get_map_list':{
			schemas.Map.find({},'_id name',buildCallback(from+':DB:'+rID+':'+func+':RESPONSE'));
			break;
		};
		case 'get_map_data':{
			schemas.Map.findById(d.id,buildCallback(from+':DB:'+rID+':'+func+':RESPONSE'));
			break;
		};
		case 'get_char_list':{
			schemas.Character.find({},'_id name',buildCallback(from+':DB:'+rID+':'+func+':RESPONSE'));
			break;
		};
		case 'get_char_data':{
			schemas.Character.findById(d.id,'_id name',buildCallback(from+':DB:'+rID+':'+func+':RESPONSE'));
			break;
		};
		case 'save_map':{
			if(d.data._id !== undefined){
				schemas.Map.findOneAndUpdate({_id:d.data._id}, d.data, buildCallback(from+':DB:'+rID+':'+func+':RESPONSE'))
			}else{
				var map = new schemas.Map(d.data);
				map.save(function (err) {
					if (err){
						client_pub.publish(from+':DB:'+rID+':'+func+':RESPONSE', JSON.stringify({err:'fail',data:err}));
					}else{
						client_pub.publish(from+':DB:'+rID+':'+func+':RESPONSE', JSON.stringify({data:map}));
					}
				});
			}
			break;
		};
		case 'delete_map':{
			schemas.Map.findById(d.id,function (err, data) {
				if (err) return console.error(err);
				data.remove(buildCallback(from+':DB:'+rID+':'+func+':RESPONSE'));
			});
		};
		default:{
			
		}
	};
});




// this.getMapDataOf = function(id, callback){
	// schemas.Map.findById(id,function (err, data) {
		// if (err) return console.error(err);
		// callback(data);
	// });
// };

// this.getCharList = function(callback){
	// schemas.Character.find({},'_id name',function (err, data) {
		// if (err) return console.error(err);
		// callback(data);
	// });
// };

// this.getCharDataOf = function(id, callback){
	// schemas.Character.findById(id,function (err, data) {
		// if (err) return console.error(err);
		// callback(data);
	// });
// };

// this.addNewMap = function(dataG, callback){
	// var hexs = mapGenerator.generate({
		// height : dataG.height,
		// width : dataG.width,
		// seed : dataG.seed,
		// degree : dataG.degree,
		// landSea : dataG.landSea,
		// patchSize : dataG.patchSize,
		// noiseImpact : dataG.noiseImpact
	// });

	// var map = new schemas.Map({
		// name : dataG.width+":"+dataG.height+","+dataG.seed+","+dataG.patchSize+","+dataG.noiseImpact,
		// width : dataG.width,
		// height : dataG.height,
		// landSea : dataG.landSea,
		// patchSize : dataG.patchSize,
		// noiseImpact : dataG.noiseImpact,
		// hexs : hexs
	// });
	// map.save(function (err) {
		// if (err) return console.error(err);
		// getMapList(callback);
	// });
// };

// this.remMap = function(id, callback){
	// schemas.Map.findById(id,function (err, data) {
		// if (err) return console.error(err);
		// data.remove(function(err){
			// if (err) return console.error(err);
			// getMapList(callback);
		// });
	// });
// };

// function random (low, high) {
	// return Math.round(Math.random() * (high - low) + low);
// }
// var dummyChar= function(i){
	// var dummy={
		// attributs:{
		// physic:{
			// strength:random(1,5),
			// dexterity:random(1,5),
			// stamina:random(1,5)
		// },
		// social:{
			// charisma:random(1,5),
			// empathy:random(1,5),
			// will:random(1,5)
		// },
		// mental:{
			// logic:random(1,5),
			// ingeniosity:random(1,5),
			// abstraction:random(1,5)
		// }
	// },
	// skills : {
		// combat:{
			// offensive:random(1,5),
			// defensive:random(1,5),
			// subversive:random(1,5)
		// },
		// move:{
			// athletism:random(1,5),
			// acrobatics:random(1,5),
			// stealth:random(1,5)
		// },
		// social:{
			// presence:random(1,5),
			// bargain:random(1,5),
			// subterfuge:random(1,5)
		// },
		// empirism:{
			// engineering:random(1,5),
			// nature:random(1,5),
			// crafts:random(1,5)
		// },
		// knowledge:{
			// mysticism:random(1,5),
			// civilization:random(1,5),
			// science:random(1,5)
		// },
		// gift:{
			// power:random(1,5),
			// weaving:random(1,5),
			// influence:random(1,5)
		// }
	// },
	// status : {
		// endurance:{
			// breath : random(1,10),
			// recorvery : random(1,10),
			// exhaustion : random(1,20)
		// },
		// health:{
			// vitality : random(1,10),
			// regeneration : random(1,10),
			// wounds : {
				// superficial : { threshold:random(1,20), level:random(1,10)},
				// minor : { threshold:random(1,40), level:random(1,8)},
				// deep : { threshold : random(1,60),level:random(1,6)},
				// serious : { threshold : random(1,80),level:random(1,3)},
				// fatal : { threshold : random(1,100),level:random(1,1)},
			// }
		// },
		// psych:{
			// moral : random(1,5),
			// adrenaline : random(1,5),
			// serenity : random(1,5)
		// }
	// }
	// }
	// dummy.playerId="player "+i;
	// return dummy;
// }

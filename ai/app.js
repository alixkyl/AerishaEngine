var redis = require("redis"),
	client_pub = redis.createClient(6379,'127.0.0.1'),
	client_sub = redis.createClient(6379,'127.0.0.1');

client_sub.on('pmessage', function (channel, message) {
	console.log(channel);
	var param = channel.split(':');
	var USERID = param[1];
	if( param[2] == "SAVE_MAP"){
		if(param[3] == "START"){
			client_pub.publish('DATA:'+USERID+':SAVE_MAP:START', JSON.stringify(message));
			client_sub.subscribe('DATA:'+USERID+':SAVE_MAP:DONE');
		}else{
			client_pub.publish('EDITOR:'+USERID+':SAVE_MAP:DONE', JSON.stringify({result:'OK'}));
			client_sub.unsubscribe(channel);
		}
	}else if( param[2] == "SAVE_CHARACTER"){
		if(param[3] == "START"){
			client_pub.publish('DATA:'+USERID+':SAVE_CHARACTER:START', JSON.stringify(message));
			client_sub.subscribe('DATA:'+USERID+':SAVE_CHARACTER:DONE');
		}else{
			client_pub.publish('EDITOR:'+USERID+':SAVE_CHARACTER:DONE', JSON.stringify({result:'OK'}));
			client_sub.unsubscribe(channel);
		}
	}
});
client_sub.on('psubscribe' , function (channel, message) {
	console.log('psubscribe',channel,message);
});

client_sub.psubscribe('EDITOR:USERID:*');
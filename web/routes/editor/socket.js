module.exports = function(nconf,server,sessionStore,cookieParser) {

	var io 				= require( 'socket.io')(server)
	, passportSIo 		= require( 'passport.socketio')
	  , redis 			= require("redis")
	  , client_pub 		= redis.createClient(sessionStore)
	  , client_sub 		= redis.createClient(sessionStore);
	  
	function onAuthorizeSuccess(data, accept){  
		console.log('successful connection to socket.io');
		accept(); //Let the user through
	}

	function onAuthorizeFail(data, message, error, accept){ 
		if(error) accept(new Error(message));
		console.log('failed connection to socket.io:', message);
		accept(null, false);  
	}

	io.use(passportSIo.authorize({ //configure socket.io
	   cookieParser: cookieParser,
	   secret:      'cookie_secret',    // make sure it's the same than the one you gave to express
	   store:       sessionStore,        
	   success:     onAuthorizeSuccess,  // *optional* callback on success
	   fail:        onAuthorizeFail,     // *optional* callback on fail/error
	}));

	var subs={};
	var sockets={};
	io.of('/editor').on('connection', function (socket) {
		var id = socket.request.user.id;
		sockets[id] = socket;
		
		socket.on('getMapList',function (data) {
			client_sub.subscribe('WEB:DB:'+id+':get_map_list:RESPONSE');
			client_pub.publish('DB:WEB:'+id+':get_map_list', JSON.stringify({}));
			subs['WEB:DB:'+id+':get_map_list:RESPONSE'] = function(res){
				if(res.err !== undefined){
					console.log('fail DB:'+id+':get_map_list:RESPONSE',res);
				}else{
					socket.emit('resMapList', res.data);
				}
			};
		});
		
		socket.on('getMapData',function (id) {
			client_sub.subscribe('WEB:DB:'+id+':get_map_data:RESPONSE');
			client_pub.publish('DB:WEB:'+id+':get_map_data', JSON.stringify({id:id}));
			subs['WEB:DB:'+id+':get_map_data:RESPONSE'] = function(res){
				if(res.err !== undefined){
					console.log('fail DB:'+id+':get_map_data:RESPONSE',res);
				}else{
					socket.emit('resMapData', res.data);
				}
			};
		});
		
		socket.on('getCharList',function (data) {
			client_sub.subscribe('WEB:DB:'+id+':get_char_list:RESPONSE');
			client_pub.publish('DB:WEB:'+id+':get_char_list', JSON.stringify({}));
			subs['WEB:DB:'+id+':get_char_list:RESPONSE'] = function(res){
				if(res.err !== undefined){
					console.log('fail DB:'+id+':get_char_list:RESPONSE',res);
				}else{
					socket.emit('resCharList', res.data);
				}
			};
		});
		
		socket.on('getCharData',function (id) {
			client_sub.subscribe('WEB:DB:'+id+':get_char_data:RESPONSE');
			client_pub.publish('DB:WEB:'+id+':get_char_data', JSON.stringify({id:id}));
			subs['WEB:DB:'+id+':get_char_data:RESPONSE'] = function(res){
				if(res.err !== undefined){
					console.log('fail DB:'+id+':get_char_data:RESPONSE',res);
				}else{
					socket.emit('resCharData', res.data);
				}
			};
		});
		
		socket.on('save_map',function (data) {
			client_sub.subscribe('WEB:DB:'+id+':save_map:RESPONSE');
			client_pub.publish('DB:WEB:'+id+':save_map', JSON.stringify({data:data}));
			subs['WEB:DB:'+id+':save_map:RESPONSE'] = function(res){
				if(res.err !== undefined){
					console.log('fail DB:'+id+':save_map:RESPONSE',res);
				}else{
					socket.emit('resMapData', res.data);
				}
			};
		});
		
		socket.on('delete_map',function (id) {
			client_sub.subscribe('WEB:DB:'+id+':delete_map:RESPONSE');
			client_pub.publish('DB:WEB:'+id+':delete_map', JSON.stringify({id:id}));
			subs['WEB:DB:'+id+':delete_map:RESPONSE'] = function(res){
				if(res.err !== undefined){
					console.log('fail DB:'+id+':delete_map:RESPONSE',res);
				}else{
					socket.emit('resMapList', res.data);
				}
			};
		});
	});

	client_sub.on('message', function (channel, message) {
		subs[channel](JSON.parse(message));
		delete subs[channel];
		client_sub.unsubscribe(channel);
	});
};
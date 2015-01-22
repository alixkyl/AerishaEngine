var fs = require('fs');
var map = require('./lib/Hexgenerator.js');
var res = map.generateMap(200,2,25,0.05);
fs.writeFile('./plop.json', JSON.stringify(res, null, 4), function(err,data){
if (err){
	console.log(data);
	console.log(err);
	}
});
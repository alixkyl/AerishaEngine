var mongoose = require('mongoose');
var hexSchema = mongoose.Schema({
				mapId:String,
                name: String,
                q: Number,
                r: Number,
                height: Number,
                moist: Number
            });
			
exports.Hex = mongoose.model('Hex', hexSchema);

var organisationSchema = mongoose.Schema({
				organisationId:String,
                nameT: mongoose.Schema.Types.ObjectId,
                members:[mongoose.Schema.Types.ObjectId],
                supOrganisation:mongoose.Schema.Types.ObjectId,
				subOrganisations:[mongoose.Schema.Types.ObjectId]
            });
			
exports.Organisation = mongoose.model('Orgnisation', organisationSchema);
/**
var attributSchema = mongoose.Schema({
	nameT:{type:String, default: "attribut" },
	value:{type:Number, default: 0 }
});
var attributCatSchema = mongoose.Schema({
		nameT:{type:String, default: "attribut category" },
		values : [attributSchema]
});
var skillSchema = mongoose.Schema({
	nameT:{type:String, default: "skill" },
	value:{type:Number, default: 0 }
});
var skillCatSchema = mongoose.Schema({
	nameT:{type:String, default: "skill category" },
	values : [skillSchema]
});

var characterSchema = mongoose.Schema({
	playerId:{type:String, default: "playerId" },
	name: {type:String, default: "name" },
	attributs : [attributCatSchema],
	skills : [skillCatSchema],
	status : [statusSchema]
});
var statusSchema = mongoose.Schema({
	endurance:{
		nameT:"endurance",
		breath : {nameT : "breath", level : {type:Number, default: 0 }},
		recorvery : {nameT : "recorvery", level : {type:Number, default: 0 }},
		exhaustion : {nameT : "exhaustion", level : {type:Number, default: 0 }}
	},
	health:{
		nameT : "health",
		vitality : {nameT:"vitality",level:{type:Number, default: 0 }},
		regeneration : {nameT : "regeneration", level : {type:Number, default: 0 }},
		wounds : [
			{nameT : "armor", threshold:{type:Number, default: 0 }, level : {type:Number, default: 0 }},
			{nameT : "minor", threshold:{type:Number, default: 0 }, level : {type:Number, default: 0 }},
			{nameT : "deep", threshold : {type:Number, default: 0 }, level : {type:Number, default: 0 }},
			{nameT : "serious", threshold : {type:Number, default: 0 }, level : {type:Number, default: 0 }},
			{nameT : "fatal", threshold : {type:Number, default: 0 }, level : {type:Number, default: 0 }},
		]
	},
	psych:{
		nameT : "psych",
		moral : {nameT : "moral", level : {type:Number, default: 0 }},
		adrenaline : {nameT : "adrenaline", level : {type:Number, default: 0 }},
		serenity : {nameT : "serenity", level : {type:Number, default: 0 }}
	}
});
*/
/**
// var attributSchema = mongoose.Schema({
		// nameT:String,
		// values : {
			// strength:{nameT:mongoose.Schema.Types.ObjectId,level:Number},
			// dexterity:{nameT:mongoose.Schema.Types.ObjectId,level:Number},
			// stamina:{nameT:mongoose.Schema.Types.ObjectId,level:Number}
		// }
	// },
	// social:{
		// nameT:mongoose.Schema.Types.ObjectId,
		// subValues : {
			// charisma:{nameT:mongoose.Schema.Types.ObjectId,level:Number},
			// empathy:{nameT:mongoose.Schema.Types.ObjectId,level:Number},
			// will:{nameT:mongoose.Schema.Types.ObjectId,level:Number}
			// }
	// },
	// mental:{
		// nameT:mongoose.Schema.Types.ObjectId,
		// subValues : {
			// logic:{nameT:mongoose.Schema.Types.ObjectId,level:Number},
			// ingeniosity:{nameT:mongoose.Schema.Types.ObjectId,level:Number},
			// abstraction:{nameT:mongoose.Schema.Types.ObjectId,level:Number}
		// }
	// }
// });
*/
/**
// var skillSchema = mongoose.Schema({
				// combat:{
					// nameT:mongoose.Schema.Types.ObjectId,
					// subValues : {
						// offensive:{nameT:mongoose.Schema.Types.ObjectId,level:Number},
						// defensive:{nameT:mongoose.Schema.Types.ObjectId,level:Number},
						// subversive:{nameT:mongoose.Schema.Types.ObjectId,level:Number}
					// }
				// },
				// move:{
					// nameT:mongoose.Schema.Types.ObjectId,
					// subValues : {
						// athletism:{nameT:mongoose.Schema.Types.ObjectId,level:Number},
						// acrobatics:{nameT:mongoose.Schema.Types.ObjectId,level:Number},
						// stealth:{nameT:mongoose.Schema.Types.ObjectId,level:Number}
					// }
				// },
				// social:{
					// nameT:mongoose.Schema.Types.ObjectId,
					// subValues : {
						// presence:{nameT:mongoose.Schema.Types.ObjectId,level:Number},
						// bargain:{nameT:mongoose.Schema.Types.ObjectId,level:Number},
						// subterfuge:{nameT:mongoose.Schema.Types.ObjectId,level:Number}
					// }
				// },
				// empirism:{
					// nameT:mongoose.Schema.Types.ObjectId,
					// subValues : {
						// engineering:{nameT:mongoose.Schema.Types.ObjectId,level:Number},
						// nature:{nameT:mongoose.Schema.Types.ObjectId,level:Number},
						// crafts:{nameT:mongoose.Schema.Types.ObjectId,level:Number}
					// }
				// },
				// knowledge:{
					// nameT:mongoose.Schema.Types.ObjectId,
					// subValues : {
						// mysticism:{nameT:mongoose.Schema.Types.ObjectId,level:Number},
						// civilization:{nameT:mongoose.Schema.Types.ObjectId,level:Number},
						// science:{nameT:mongoose.Schema.Types.ObjectId,level:Number}
					// }
				// },
				// gift:{
					// nameT:mongoose.Schema.Types.ObjectId,
					// subValues : {
						// power:{nameT:mongoose.Schema.Types.ObjectId,level:Number},
						// weaving:{nameT:mongoose.Schema.Types.ObjectId,level:Number},
						// influence:{nameT:mongoose.Schema.Types.ObjectId,level:Number}
					// }
				// }
            // });
*/
/**
// var statusSchema = mongoose.Schema({
				// endurance:{
					// nameT:mongoose.Schema.Types.ObjectId,
					// subValues : {
						// strength : {nameT : mongoose.Schema.Types.ObjectId, level : Number},
						// dexterity : {nameT : mongoose.Schema.Types.ObjectId, level : Number},
						// stamina : {nameT : mongoose.Schema.Types.ObjectId, level : Number}
					// }
				// },
				// health:{
					// nameT : mongoose.Schema.Types.ObjectId,
					// subValues : {
						// vitality : {nameT:mongoose.Schema.Types.ObjectId,level:Number},
						// regeneration : {nameT : mongoose.Schema.Types.ObjectId, level : Number},
						// wounds : {
							// superficial : {nameT:mongoose.Schema.Types.ObjectId, threshold:Number, level : Number},
							// minor : {nameT:mongoose.Schema.Types.ObjectId, threshold:Number, level : Number},
							// deep : {nameT : mongoose.Schema.Types.ObjectId, threshold : Number,level : Number},
							// serious : {nameT : mongoose.Schema.Types.ObjectId, threshold : Number,level : Number},
							// fatal : {nameT : mongoose.Schema.Types.ObjectId, threshold : Number,level : Number},
						// }
					// }
				// },
				// psych:{
					// nameT : mongoose.Schema.Types.ObjectId,
					// subValues : {
						// moral : {nameT : mongoose.Schema.Types.ObjectId, level : Number},
						// adrenaline : {nameT : mongoose.Schema.Types.ObjectId, level : Number},
						// serenity : {nameT : mongoose.Schema.Types.ObjectId, level : Number}
					// }
				// }
            // });			
*/


var characterSchema = mongoose.Schema({
	playerId:{type:String, default: "playerId" },
	name: {type:String, default: "name" },
	attributs:{
		physic:{
			strength:{type:Number, default: 0 },
			dexterity:{type:Number, default: 0 },
			stamina:{type:Number, default: 0 }
		},
		social:{
			charisma:{type:Number, default: 0 },
			empathy:{type:Number, default: 0 },
			will:{type:Number, default: 0 }
		},
		mental:{
			logic:{type:Number, default: 0 },
			ingeniosity:{type:Number, default: 0 },
			abstraction:{type:Number, default: 0 }
		}
	},
	skills : {
		combat:{
			offensive:{type:Number, default: 0},
			defensive:{type:Number, default: 0},
			subversive:{type:Number, default: 0}
		},
		move:{
			athletism:{type:Number, default: 0},
			acrobatics:{type:Number, default: 0},
			stealth:{type:Number, default: 0}
		},
		social:{
			presence:{type:Number, default: 0},
			bargain:{type:Number, default: 0},
			subterfuge:{type:Number, default: 0}
		},
		empirism:{
			engineering:{type:Number, default: 0},
			nature:{type:Number, default: 0},
			crafts:{type:Number, default: 0}
		},
		knowledge:{
			mysticism:{type:Number, default: 0},
			civilization:{type:Number, default: 0},
			science:{type:Number, default: 0}
		},
		gift:{
			power:{type:Number, default: 0},
			weaving:{type:Number, default: 0},
			influence:{type:Number, default: 0}
		}
	},
	status : {
		endurance:{
			breath : {type:Number, default: 0},
			recorvery : {type:Number, default: 0},
			exhaustion : {type:Number, default: 0}
		},
		health:{
			vitality : {type:Number, default: 0},
			regeneration : {type:Number, default: 0},
			wounds : {
				superficial : { threshold:{type:Number, default: 0 }, level:{type:Number, default: 0 }},
				minor : { threshold:{type:Number, default: 0 }, level:{type:Number, default: 0 }},
				deep : { threshold : {type:Number, default: 0 },level:{type:Number, default: 0 }},
				serious : { threshold : {type:Number, default: 0 },level:{type:Number, default: 0 }},
				fatal : { threshold : {type:Number, default: 0 },level:{type:Number, default: 0 }},
			}
		},
		psych:{
			moral : {type:Number, default: 0},
			adrenaline : {type:Number, default: 0},
			serenity : {type:Number, default: 0}
		}
	}
});

exports.Character = mongoose.model('Character', characterSchema);
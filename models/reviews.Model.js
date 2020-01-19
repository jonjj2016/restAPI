const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
	title     : {
		type      : String,
		trim      : true,
		required  : [ true, 'Please add course title for the review' ],
		maxlength : 100
	},
	text      : {
		type     : String,
		required : [ true, 'Plesa add some text' ],
		trim     : true
	},
	rating    : {
		type     : Number,
		max      : 10,
		min      : 1,
		required : [ true, 'Pleasa add a reting between 1 and 10' ]
	},

	createdAt : {
		type    : Date,
		default : Date.now()
	},
	bootcamp  : {
		type     : mongoose.Schema.Types.ObjectId,
		ref      : 'Bootcamp',
		required : true
	},
	user      : {
		type     : mongoose.Schema.Types.ObjectId,
		ref      : 'User',
		required : true
	}
});

module.exports = mongoose.model('Review', ReviewSchema);

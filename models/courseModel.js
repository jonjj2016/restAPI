const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
	title                : {
		type     : String,
		trim     : true,
		required : [ true, 'Please add course title' ]
	},
	description          : {
		type     : String,
		required : [ true, 'Plesa add description' ],
		trim     : true
	},
	duration             : {
		type : String
		//required : [ true, 'Pleasa add duration' ]
	},
	tuition              : {
		type     : Number,
		required : [ true, 'Pleasa add tuition cost' ]
	},
	minimumSkill         : {
		type     : String,
		enum     : [ 'beginner', 'intermediate', 'advance' ],
		required : [ true, 'Plesa add minimum skill' ]
	},
	scholarshipAvailable : {
		type    : Boolean,
		default : false
	},
	createdAt            : {
		type    : Date,
		default : Date.now()
	},
	bootcamp             : {
		type     : mongoose.Schema.Types.ObjectId,
		ref      : 'Bootcamp',
		required : true
	}
});
CourseSchema.pre(/find/, function (next) {
	this.populate({ path: 'bootcamp', select: 'name description' });
	next();
});
module.exports = mongoose.model('Course', CourseSchema);

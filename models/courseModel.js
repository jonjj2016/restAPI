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
	},
	user                 : {
		type     : mongoose.Schema.Types.ObjectId,
		ref      : 'User',
		required : true
	}
});
CourseSchema.pre(/find/, function (next) {
	this.populate({ path: 'bootcamp', select: 'name description' });
	next();
});
//Static method to grt  average cost of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
	const obj = await this.aggregate([
		{
			$match : {
				bootcamp : bootcampId
			}
		},
		{
			$group : {
				_id         : '$bootcamp',
				averageCost : { $avg: '$tuition' }
			}
		}
	]);
	console.log(obj[0].averageCost.toFixed(0));
	try {
		await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
			averageCost : obj[0].averageCost.toFixed(0)
		});
	} catch (err) {}
};
// Call get average cost after save
CourseSchema.post('save', function (next) {
	this.constructor.getAverageCost(this.bootcamp);
});
// Call get average cost after remove

CourseSchema.pre('remove', function (next) {
	this.constructor.getAverageCost(this.bootcamp);
	next();
});
module.exports = mongoose.model('Course', CourseSchema);

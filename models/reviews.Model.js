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
//Static method to get  average rating of Bootcamp
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
	const obj = await this.aggregate([
		{
			$match : {
				bootcamp : bootcampId
			}
		},
		{
			$group : {
				_id           : '$bootcamp',
				averageRating : { $avg: '$rating' }
			}
		}
	]);
	//console.log(obj[0].averageCost.toFixed(0));
	try {
		await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
			averageRating : obj[0].averageRating.toFixed(1)
		});
	} catch (err) {}
};
// Call get average cost after save
ReviewSchema.post('save', function () {
	this.constructor.getAverageRating(this.bootcamp);
});
// Call get average cost after remove

ReviewSchema.pre('remove', function (next) {
	this.constructor.getAverageRating(this.bootcamp);
	next();
});
//Preven user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });
module.exports = mongoose.model('Review', ReviewSchema);

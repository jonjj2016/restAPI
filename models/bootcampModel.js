const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/giocoder');
const bootcampSchema = new mongoose.Schema(
	{
		name          : {
			type      : String,
			required  : [ true, 'Please add  a name' ],
			unique    : true,
			trim      : true,
			maxlength : [ 50, ' Name can not be more than 50 characters' ]
		},
		slug          : String,
		description   : {
			type      : String,
			required  : [ true, 'Please add a description' ],
			maxlength : [ 500, 'Description can not be more than 500 characters' ]
		},
		website       : {
			type  : String,
			match : [
				/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
				'Please use a valid URL with  HTTP or HTTPS'
			]
		},
		phone         : {
			type      : String,
			maxlength : [ 20, 'Phone number can not be loger than 20 characters' ]
		},
		email         : {
			type  : String,
			match : [
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				'Please enter a valid email'
			]
		},
		address       : {
			type     : String,
			required : [ true, 'Please add an address' ]
		},
		location      : {
			type            : {
				type : String,
				enum : [ 'Point' ]
				//required : true
			},
			coordinates     : {
				type : [ Number ]
				//required : true
				//index    : ('2dsphere')
			},
			formatedAddress : String,
			city            : String,
			street          : String,
			state           : String,
			zipcode         : String,
			country         : String
		},
		careers       : {
			type     : [ String ],
			required : true,
			enum     : [ 'Web Development', 'Mobile Development', 'UI/UX', 'Data Science', 'Business', 'Other' ],
			default  : 'Other'
		},
		averageRating : {
			type : Number,
			min  : [ 1, 'Rating shold be at least 1' ],
			max  : [ 10, 'Rating should be no more then 10' ]
		},
		averageCost   : Number,
		photo         : {
			type    : String,
			default : 'no-photo.jpeg'
		},
		housing       : {
			type    : Boolean,
			default : false
		},
		jobAssistance : {
			type    : Boolean,
			default : false
		},
		jobDuarantee  : {
			type    : Boolean,
			default : false
		},
		acceptGi      : {
			type    : Boolean,
			default : false
		},
		createdAt     : {
			type    : Date,
			default : Date.now()
		}
	},
	{
		toJSON   : { virtuals: true },
		toObject : { virtuals: true }
	}
);
//create Bootcamp slug from the name
bootcampSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	console.log('slugify run', this.slug);
	next();
});
//Geocode create location field
bootcampSchema.pre('save', async function (next) {
	const loc = await geocoder.geocode(this.address);
	this.location = {
		type             : 'Point',
		coordinates      : [ loc[0].longitude, loc[0].latitude ],
		formattedAddress : loc[0].formattedAddress,
		street           : loc[0].streetName,
		city             : loc[0].city,
		state            : loc[0].stateCode,
		zipcode          : loc[0].zipcode,
		country          : loc[0].countrycode
	};
	//do not save address in the db
	this.address = undefined;
	next();
});
//Cascade delete courses when a bootcamp is deleted

bootcampSchema.pre('remove', async function (next) {
	console.log(`Courses being deleted from bootcamp ${this.name}`);

	await this.model('Course').deleteMany({ bootcamp: this._id });
	next();
});
//bootcampSchema.virtual('courses', { ref: 'Course', localField: '_id', foreignField: 'bootcamp', justOne: false });
bootcampSchema.virtual('co', { ref: 'Course', foreignField: 'bootcamp', localField: '_id', justOne: false });
module.exports = mongoose.model('Bootcamp', bootcampSchema);
//email

const fs = require('fs');
const mongoose = require('mongoose');
const Course = require('./models/courseModel');
const colors = require('colors');
const dotenv = require('dotenv');

//Load env vars
dotenv.config({ path: './config/config.env' });
//load models
const Bootcamp = require('./models/bootcampModel');
//import users model
const User = require('./models/user');
//import reviews model
const Review = require('./models/reviews.Model');
//connect dbs

mongoose.connect(process.env.MONGO_LOCAL, {
	useUnifiedTopology : true,
	useNewUrlParser    : true
});
//read json files for bootcamps
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, `utf-8`));
//Read json files for courses
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, `utf-8`));
//Read json files for users
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, `utf-8`));
//Read json files for users
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, `utf-8`));
//import into db
const importData = async () => {
	try {
		//import bootcamp data
		await Bootcamp.create(bootcamps);
		//import courses data
		await Course.create(courses);
		//import user data
		await User.create(users);
		//import review data
		await Review.create(reviews);
		console.log('Data imported....'.green.inverse);
		process.exit();
		//process.exit();
	} catch (err) {
		console.error(err);
	}
};

//Delete Data

const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		await Course.deleteMany();
		await User.deleteMany();
		await Review.deleteMany();
		console.log('Data destroyed ....'.red.inverse);
		process.exit();
	} catch (err) {}
};

if (process.argv[2] === '-i') {
	importData();
} else if (process.argv[2] === '-d') {
	deleteData();
}

const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//Load env vars
dotenv.config({ path: './config/config.env' });
//load models
const Bootcamp = require('./models/bootcampModel');
//connect dbs

mongoose.connect(process.env.MONGO_LOCAL, {
	useUnifiedTopology : true,
	useNewUrlParser    : true
});
//read json files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, `utf-8`));
//import into db
const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		console.log('Data imported....'.green.inverse);
		process.exit();
	} catch (err) {
		console.error(err);
	}
};
//Delete Data

const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		console.log('Data destroyed ....'.red.inverse);
	} catch (err) {}
};
if (process.argv[2] === '-i') {
	importData();
} else if (process.argv[2] === '-d') {
	deleteData();
}

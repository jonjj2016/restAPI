const mongoose = require('mongoose');
const connectDB = async () => {
	const connection = await mongoose.connect(process.env.MONGO_LOCAL, {
		useUnifiedTopology : true,
		useNewUrlParser    : true
	});
	console.log(`Connected to db`.underline.bold.cyan);
};
module.exports = connectDB;

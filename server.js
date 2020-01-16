const express = require('express');
const connectDb = require('./config/db');
const dotENV = require('dotenv');
const path = require('path');
const fileuploader = require('express-fileupload');
const colosr = require('colors');
const errorHandler = require('./middleware/error');
dotENV.config({ path: './config/config.env' });
//connect to database
connectDb();
//Rout files
const bootcampRouts = require('./routs/bootcapmRout');
const coursesRouts = require('./routs/coursesRoute');
const userAuthRouter = require('./routs/authRouts');
//import middlewares
const morgan = require('morgan');
const app = express();
app.use(express.json());
app.use(fileuploader());
//Set static folder
app.use(express.static(path.join(__dirname, 'public')));
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
//mount routers
app.use('/api/v1/bootcamp', bootcampRouts);
app.use('/api/v1/courses', coursesRouts);
app.use('/api/v1/user', userAuthRouter);
app.use(errorHandler);
const PORT = parseInt(process.env.PORT) || 8400;
const server = app.listen(PORT, console.log(`Server is running in port ${PORT}`.yellow.bold));
//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(` Error ${err.message}`.red);
	//Close server & exit process
	server.close(() => process.exit(1));
});

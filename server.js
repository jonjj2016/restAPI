const express = require('express');
const connectDb = require('./config/db');
const dotENV = require('dotenv');
const path = require('path');
const fileuploader = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');
const cookie_parser = require('cookie-parser');
const helmet = require('helmet');
const xss_clean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const colosr = require('colors');
const errorHandler = require('./middleware/error');
dotENV.config({ path: './config/config.env' });
//connect to database
connectDb();
//Rout files
const bootcampRouts = require('./routs/bootcapmRout');
const coursesRouts = require('./routs/coursesRoute');
const authRouter = require('./routs/authRouts');
const userRouter = require('./routs/users.Routs');
const reviewRouter = require('./routs/reviews.Router');

//Limiting requests per minute
const requests = rateLimit({
	windowMs : 10 * 60 * 1000,
	max      : 120
});
//import middlewares
const morgan = require('morgan');
const app = express();
app.use(express.json());
//enabling file upload
app.use(fileuploader());
app.use(cookie_parser());
//Sanitizing data
app.use(mongoSanitize());
//SET SEQURITY HEADERS //XSS PROTECT HEADERS
app.use(helmet());
//Prevent XSS attaks
app.use(xss_clean());
//aplying limiter
app.use(requests);
// preventing http parametr polution
app.use(hpp());
//enabling CORS
app.use(cors());
//Set static folder
app.use(express.static(path.join(__dirname, 'public')));
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
//mount routers
app.use('/api/v1/bootcamp', bootcampRouts);
app.use('/api/v1/courses', coursesRouts);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/auth/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use(errorHandler);
const PORT = parseInt(process.env.PORT) || 8400;
const server = app.listen(PORT, console.log(`Server is running in port ${PORT}`.yellow.bold));
//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(` Error ${err.message}`.red);
	//Close server & exit process
	server.close(() => process.exit(1));
});

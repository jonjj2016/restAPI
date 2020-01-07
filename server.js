const express = require('express');
const connectDb = require('./config/db');
const dotENV = require('dotenv');
const colosr = require('colors');
dotENV.config({ path: './config/config.env' });
//connect to database
connectDb();
//Rout files
const bootcampRouts = require('./routs/bootcapmRout');
//import middlewares
const morgan = require('morgan');
const app = express();
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
//mount routers
app.use('/api/v1/bootcamp', bootcampRouts);
const PORT = parseInt(process.env.PORT) || 8400;
const server = app.listen(PORT, console.log(`Server is running in port ${PORT}`.yellow.bold));
//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(` Error ${err.message}`.red);
	//Close server & exit process
	server.close(() => process.exit(1));
});

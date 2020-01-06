const express = require('express');
const mongoose = require('mongoose');
const dotENV = require('dotenv');
//connecting to db local for first
mongoose.connect('mongodb://localhost:27017/devCamp', { useUnifiedTopology: true, useNewUrlParser: true }, () => {
	console.log('DB Connected');
});
//Rout files
const bootcampRouts = require('./routs/bootcapmRout');
//import middlewares
const middlewares = require('./middleware/logger');
const morgan = require('morgan');
dotENV.config({ path: './config/config.env' });
const app = express();
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
//mount routers
app.use('/api/v1/bootcamp', bootcampRouts);
const PORT = parseInt(process.env.PORT) || 8400;
app.listen(PORT, console.log(`Server is running in port ${PORT}`));

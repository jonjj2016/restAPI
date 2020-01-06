const express = require('express');
const dotENV = require('dotenv');
dotENV.config({ path: './config/config.env' });
const app = express();
const PORT = parseInt(process.env.PORT) || 4000;
app.listen(PORT, console.log(`Server is running in port ${PORT}`));

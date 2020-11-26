const express = require('express');
const dotenv = require('dotenv').config({ path: './config/config.env' });

app = express();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`App running in ${process.env.NODE_ENV} mode listening on port ${PORT}!`);
});
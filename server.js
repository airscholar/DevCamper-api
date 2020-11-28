const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const colors = require('colors')
const dotenv = require('dotenv').config({ path: './config/config.env' });
const bootcampRouter = require('./routers/bootcamps/bootcamps.router');
const { logger } = require('./middleware/logger');
const { connectDB } = require('./config/db');

app = express();
app.use(morgan('tiny'));
app.use(helmet());
app.use(express.json())

// connect mongodb database
connectDB();
const PORT = process.env.PORT;

app.use(logger);
app.use('/api/v1/bootcamps', bootcampRouter);

app.listen(PORT, () => {
  console.log(
    `App running in ${process.env.NODE_ENV} mode listening on port ${PORT}!`.yellow.bold
  );
});

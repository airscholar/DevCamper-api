const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv').config({ path: './config/config.env' });
const bootcampRouter = require('./routers/bootcamps/bootcamps.router');
const courseRouter = require('./routers/courses/courses.router');
const { logger } = require('./middleware/logger');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/error');

app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(helmet());
app.use(express.json());

// connect mongodb database
connectDB();
const PORT = process.env.PORT;

app.use(logger);
app.use(fileUpload())

app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', courseRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `App running in ${process.env.NODE_ENV} mode listening on port ${PORT}!`
      .yellow.bold
  );
});

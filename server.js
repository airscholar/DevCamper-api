const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const colors = require('colors');
const path = require('path');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv').config({ path: './config/config.env' });
const cookieParser = require('cookie-parser');

//routes
const bootcampRouter = require('./routers/bootcamps/bootcamps.route');
const courseRouter = require('./routers/courses/courses.route');
const reviewRouter = require('./routers/reviews/reviews.route');
const authRouter = require('./routers/auth/auth.route');

//middleware
const { logger } = require('./middleware/logger.middleware');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/error.middleware');

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
app.use(fileUpload());
app.use(cookieParser());

//set static file
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/auth', authRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `App running in ${process.env.NODE_ENV} mode listening on port ${PORT}!`
      .yellow.bold
  );
});

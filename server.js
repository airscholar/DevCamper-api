const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const colors = require('colors');
const path = require('path');
const fileUpload = require('express-fileupload');
const sanitize = require('express-mongo-sanitize');
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
//set security headers
app.use(helmet());
//prevent XSS scripting
app.use(xss());
//hpp param pollution
app.use(hpp());
//rate limit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 minutes
  max: 100,
});
app.use(limiter);

//enable cors
app.use(cors()); 

app.use(express.json());

// connect mongodb database
connectDB();
const PORT = process.env.PORT;

app.use(logger);
app.use(cookieParser());
app.use(fileUpload());
app.use(sanitize());

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

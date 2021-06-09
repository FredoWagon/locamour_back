var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const bodyParser = require('body-parser');

const { mail } = require('./lib/nodemailer');

const Annonce = require('./models/annonce');

require('dotenv').config({ path: '.env' });

const mongoose = require('mongoose');

const { AppError, sendErrorHandler, catchAsync } = require('./lib/utils');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin')
const annonce = require('./models/annonce');


// CONFIG


const port = 3500;

var app = express();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// CONNECT DB EN ASYNC

const connectDB = catchAsync(async () => {
  await mongoose.connect(process.env.DATABASE,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  console.log('Connexion à MongoDB réussie !')
})


// // On connect le module mongoose à la DB
// mongoose.connect(process.env.DATABASE,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => console.log('Connexion à MongoDB réussie !'))
//   .catch(() => console.log('Connexion à MongoDB échouée !'));
connectDB();



  // ROUTING


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/frebite1234', adminRouter);
app.use('/bonjour', (req, res, next) => {
  res.render('testindex')
})
app.get('/design', (req, res, next) => {
  res.render('design');
})
app.use('/notification', adminRouter);
app.use('/annonce', adminRouter)
app.use('/', adminRouter)


// app.all('*', (req, res, next) => {
//   const err = new Error(`Can't find ${req.originalUrl} on this server!`);
//   err.status = 'fail';
//   err.statusCode = 404;

//   next(err);
// });




// GESTION ERREUR



// Système provenant de antivirus

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(sendErrorHandler);




// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   console.log('catch 404 and forwatd to error handler')
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);

// });

module.exports = app;

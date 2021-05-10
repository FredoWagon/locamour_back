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

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const annonce = require('./models/annonce');

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

app.use(bodyParser.urlencoded({ extended: true }));




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// On connect le module mongoose à la DB
mongoose.connect(process.env.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/bureau', async (req,res,next) => {
  try {
    const firstAnnonce = await Annonce.findById('60983295fbf788303fd4d243');
    console.log(firstAnnonce)



    res.render('bureau', {firstAnnonce: firstAnnonce})

  } catch (error) {
    console.log(error)

  }


})



app.use('/pdf', (req, res, next) => {
  const file = './public/fichier.pdf'
  res.download(file)
} )

app.post('/add', async (req, res, next) => {
try {
   console.log("/add req.body =>");
  console.log(req.body.formData);
  const NouvelleAnnonce = new Annonce(req.body.formData)
  NouvelleAnnonce.save();
  await mail(res,"fred");

res.json({message: "Annonce rajouté avec succès!", data: NouvelleAnnonce})

} catch (error) {
  console.log(error)
}

})


*

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

});

module.exports = app;

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require ('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const expressPartials = require('express-partials');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const jsonParser = bodyParser.json();
const flash = require('connect-flash');
const session = require ('express-session');
const passport = require('passport')
const favicon = require('serve-favicon');


require('./config/passport')(passport);


/*  ---------------------------------------------  */
/*                      Mongo DB                   */
/*  ---------------------------------------------  */

console.log('process.env.DATABASE_URL ' + process.env.DATABASE_URL)
const mongoose = require ('mongoose');
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false })
const db = mongoose.connection;
db.on('error', error => console.error(error))
db.once('open',()  => console.log('Connected Mongo'))
// mongodb://127.0.0.1:27017/Password_Management_System
// live DATABASE_URL in .env is :  mongodb://127.0.0.1:27017/Password_Management_System, {useNewUrlParser: true}||




/*  ---------------------------------------------  */
/*            App Use And Set Methods              */
/*  ---------------------------------------------  */

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views') );
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
// app.use(expressPartials);
app.use(express.static (__dirname + 'public') );
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(path.join(__dirname , 'public', 'images', 'favicon.ico')));


/*  ---------------------------------------------  */
/*               Express    Session                */
/*  ---------------------------------------------  */

app.use(session({
  secret: 'mubi',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 600000 * 3 },  // 30 minutes session
}))    
      


/*  ---------------------------------------------  */
/*              Passport    middleware             */
/*  ---------------------------------------------  */

app.use(passport.initialize());
app.use(passport.session());

//   C o n n e c t   F l a s h      
app.use(flash());
      
//   Global Variables for flash Messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next();
})



/*  ---------------------------------------------  */
/*                Global Routes                    */
/*  ---------------------------------------------  */

const homeRouter = require('./routes/index')
app.use( ('/'), homeRouter );

const registerRouter = require('./routes/auth-system')
app.use( ('/'), registerRouter );

const loginRouter = require('./routes/auth-system')
app.use( ('/'), loginRouter );

const forgetRouter = require('./routes/auth-system')
app.use( ('/'), forgetRouter );

// const verifyRouter = require('./routes/auth-system')
// app.use( ('/'), verifyRouter );

// const searchRouter = require('./routes/search')
// app.use( ('/'), searchRouter );

// const newPasswordRouter = require('./routes/auth-system')
// app.use( ('/'), newPasswordRouter );




/*  ---------------------------------------------  */
/*                     User                        */
/*  ---------------------------------------------  */


const myProfileMainRouter = require('./routes/myProfile')
app.use( ('/'), myProfileMainRouter );

const dashboardRouter = require('./routes/dashboard')
app.use( ('/'), dashboardRouter );


/*  ---------------------------------------------  */
/*                 Admin Routes                    */
/*  ---------------------------------------------  */

const AdminRouter = require('./routes/admin')
app.use( ('/admin'), AdminRouter );


/*  ---------------------------------------------  */
/*                  listening Port                 */
/*  ---------------------------------------------  */  

const port1 = 4000
app.listen(process.env.PORT || port1);
console.log('listen at port: ' + port1)
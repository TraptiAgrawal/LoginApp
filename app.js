
var express= require('express');
var path= require('path');
var cookieParser= require('cookie-parser');
var bodyParser= require('body-parser');
var exphbrs= require('express-handlebars');
var expressValidator= require('express-validator');
var session= require('express-session');
var flash= require('connect-flash');
var passport= require('passport');
var LocalStrategy= require('passport-local').Strategy;
var mongodb= require('mongodb');
var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
var db =  mongoose.connection;

var routes = require('./routes/index');
var users =  require('./routes/users');

//Init App
var app = express();

//express session
app.use(session({
    secret : 'secret',
    saveUninitialized :true,
    resave : true
}));

//View Engine
app.set('views',path.join(__dirname,'views'));//to append views to all views as this will be the base folder for all views
app.engine('handlebars',exphbrs({defaultLayout :'layout'}));
app.set('view engine','handlebars');

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cookieParser());

//set static folder
app.use(express.static(path.join(__dirname,'public')));  //public folder for css, images, jquery etc
app.use(expressValidator());



//passport init
app.use(passport.initialize());
app.use(passport.session());

process.on('unhandledRejection', up => { throw up });

//connect flash
app.use(flash());

//Error Messages
app.use(function(req, res, next){
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user || null;
    next();
});

app.use('/',routes);
app.use('/users',users);

//setting up server port
app.set('port', process.env.port || 3000);

//server listening
app.listen(app.get('port'),function(){
    console.log("Server started at port" + app.get('port'));
});


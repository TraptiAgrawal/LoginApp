var express = require('express');
//var expressValidator = require('express-validator')
var router = express.Router();
var User = require('../models/user');

var passport = require('passport');
var LocalStrategy= require('passport-local').Strategy;

//router.use(expressValidator());

//register
router.get('/register', function(req, res){
   res.render('register');   //render a view named register
 //   res.send('register');
});

//login
router.get('/login', function(req, res){
   res.render('login');   //render a view named login
   // res.send('login');
});

//register User
router.post('/register', function(req, res){
   var fullname = req.body.fullname;
   var email = req.body.email;
   var username = req.body.username;
   var password = req.body.password;
   var password2 = req.body.password2;


    req.checkBody('fullname','Name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('username','Username is required').notEmpty();
    if(email) {req.checkBody('email','Email is not valid').isEmail(); }
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password2','Passwords are not matching').equals(req.body.password);


    var errors = req.validationErrors();

    if (errors) {
       res.render('register', {errors :errors});

    }
    else
    {
       console.log("Yes");
       var newUser = new User({
           name : fullname,
           email :email,
           username : username,
           password :password
       });
       User.createUser(newUser, function(err,user){
         if(err){
            throw err;

         }
         console.log(user);
       });

       req.flash('success_msg','You are now registered and can login');
       res.redirect('/users/login');
    }


});


passport.use(new LocalStrategy(function(username, password, done){
   User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(!user) {
         return done(null, false, {message : 'Unknown User!'});
      }
      User.comparePassword(password,user.password,function(err, isMatch){
         if(err) throw err;
         if(isMatch) {
            return done(null, user);
         }
         else {
            return done(null, false, {message :'Password not matching'});
         }
      });
    });
}));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local',{successRedirect :'/', failureRedirect : '/users/login', failureFlash :true}),
    function(req, res){
      res.redirect('/');
});

router.get('/logout',function(req, res){
   req.logout();

   req.flash('success_msg','You are logged out now.');
   res.redirect('/users/login');
});

module.exports = router;
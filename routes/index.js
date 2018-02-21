var express = require('express');
var router = express.Router();

//get Home page
router.get('/', ensureAuthenticated, function(req, res){
   res.render('index');   //render a view named index
  //  res.send('Index');
});

function ensureAuthenticated(req,res,next) {
  if (req.isAuthenticated()) {
     next();
  }
  else{
    //  req.flash("error_msg","You are not logged in");
      res.redirect("/users/login");
  }
};

module.exports = router;
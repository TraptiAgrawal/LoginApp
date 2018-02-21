var mongoose = require('mongoose');
var bcrypt =  require('bcryptjs');

//mongoose.connect('mongodb://localhost/loginapp');  // we have this in the app.js for global

//var db = mongoose.connection;

var userSchema = mongoose.Schema({
    username: {
        type : String,
        index : true
    },
    password : {
        type: String
    },
    email : {
        type: String
    },
    name : {
        type: String
    }
});

var User = module.exports = mongoose.model('User', userSchema); //this is my collection

module.exports.createUser = function (newUser, callback) {

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB.
            newUser.password = hash;
            newUser.save(callback);

        });
    });
};

module.exports.getUserByUsername = function(username, callback){
    var query = {username : username};
    User.findOne(query, callback);
};

module.exports.comparePassword = function(inputPassword, hash, callback ){
    bcrypt.compare(inputPassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null,isMatch);
    });
};

module.exports.getUserById = function(userid, callback){
    User.get(userid,callback);
};
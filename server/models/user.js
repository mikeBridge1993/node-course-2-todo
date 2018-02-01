const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.generateAuthToken = function (){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc').toString();
    
    user.tokens.push({access, token});
   
    return user.save().then(() => { //Não percebo isso
        return token;
    });
    
};


UserSchema.methods.toJSON = function (){
    var user = this;
    var userObject = user.toObject(); 
    return _.pick(userObject, ['_id', 'email']);
}


UserSchema.statics.findByToken = function (token) {
    var User = this; //this means the USER scheme in general, such as user.findcenas...,
    var decoded;
    
    try{
        decoded = jwt.verify(token, 'abc');
    } catch (e) {
//        return new Promise((resolve, reject) => { //this will return a promise which the "then" in server.js will reject and the catch will catch it
//            reject();
        return Promise.reject();
    }
    
    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};






const user = mongoose.model('user', UserSchema);

module.exports = {
    user
};

//var newUser = new user({
//    email:"asas"
//});
//
//newUser.save().then((doc) => {
//    console.log('Saved todo', doc);
//}, (e) => {
//    console.log('Unable to save user', e);
//});
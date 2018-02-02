const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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


UserSchema.methods.removeToken = function (token) {
    var user = this;
    
    return user.update({
        $pull: {
            tokens: {
                token: token
            }
        }  
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    
    return User.findOne({email}).then((doc) => {
        
        if(!doc){
            return Promise.reject(); //goes to catch
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, doc.password, (err, resp) => {
            
                if(resp){
                    resolve(doc);
                } else {
                    reject(doc); //triggers catch in server.js
                }
            });    
        });
    });
};
                            

UserSchema.pre('save', function (next) { //Middleware to perform this task before saving.
    var doc = this;
    
    if(doc.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(doc.password, salt, (err, hash) => {
                if(!err){
                    doc.password = hash;
                    next();
                }
            }); 
        });
    } else {
        next();
    }
    
    
});




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
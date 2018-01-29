const mongoose = require('mongoose');

let user = mongoose.model('user', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    }
});

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
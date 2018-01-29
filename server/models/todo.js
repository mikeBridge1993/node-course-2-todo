const mongoose = require('mongoose');


let todo = mongoose.model('todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

module.exports = {
    todo
};

//var otherTodo = new todo({
//    text: '               Make Love Not War                        ',
//    completed: true
//});
//
//otherTodo.save().then((doc) => {
//    console.log('Saved todo', doc);
//}, (e) => {
//    console.log('Unable to save todo');
//});
//
//
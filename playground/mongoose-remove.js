const {mongoose} = require('./../server/db/mongoose');
const {todo} = require('./../server/models/todo'); //load of collection "todos"
const {user} = require('./../server/models/user'); //load of collection "user"
const {ObjectID} = require('mongodb');

todo.remove({}).then((result) => {  //We do not get the removed object back
    console.log(result);
});

todo.findOneAndRemove({}).then((result) => { //We get the removed object back
    console.log(result);
});

todo.findByIdAndRemove({}).then((result) => { //We get the removed object back
    console.log(result);
});
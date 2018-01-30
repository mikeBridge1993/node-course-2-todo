const {mongoose} = require('./../server/db/mongoose');
const {todo} = require('./../server/models/todo'); //load of collection "todos"
const {user} = require('./../server/models/user'); //load of collection "user"
const {ObjectID} = require('mongodb');

const id = "5a706a45827bcd2240209544";

if(!ObjectID.isValid(id)){ //Validation of user ID
    console.log("ID not valid");
}
//todo.find({_id: id}).then((todos) => {
//    if(!todos){
//        return console.log("Todo not found. Please try again.");
//    }
//    console.log("Todos", todos)
//});
//
//
//todo.findOne({completed: false}).then((todos) => {
//    if(!todos){
//        return console.log("Todo not found. Please try again.");
//    }
//    console.log("Todos", todos)
//});

//todo.findById(id).then((todos) => {
//    if(!todos){
//        return console.log("Todo not found. Please try again.");
//    }
//    console.log("Todos", todos)
//});


user.findById('5a6f7590f802c3151c7d2b32').then((user) => {
    if(!user){
        return console.log("User not found. Please try again.");
    }
    console.log(JSON.stringify(user, undefined, 2));
}, (e) => {
    console.log(e)
});
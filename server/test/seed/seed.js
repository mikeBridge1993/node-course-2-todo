const {ObjectID} = require('mongodb');

const {todo} = require('./../../models/todo');
const {user} = require('./../../models/user');
const jwt = require('jsonwebtoken');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const todos = [{
    text: "First test todo",
    _id: new ObjectID(),
    _creator: userOneId
}, {
    text: "Second test todo",
    _id: new ObjectID(),
    completed: true,
    completedAt: 12323,
    _creator: userTwoId
}];




const users = [
    {
    _id: userOneId,
    email: 'miguelponte@cenas1.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc').toString()
    }]
    }, {
    _id: userTwoId,
    email: 'tiagomartins@cenas.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc').toString()
    }]
    }];

const populateTodos = (done) => {
    todo.remove({}).then(() => {
        return todo.insertMany(todos); 
    }).then(() => done()); 
}

const populateUsers = (done) => {
    user.remove({}).then(() => { //The insert many method above does not have the middleware to create the password has, therefore we need to use the save method which has that middleware
        var userOne = new user(users[0]).save(); //async
        var userTwo = new user(users[1]).save(); // async
        
       return Promise.all([userOne, userTwo]);
    }).then(() => done()); 
}

module.exports = {todos, populateTodos, users, populateUsers}
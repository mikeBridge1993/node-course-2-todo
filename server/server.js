require('./config/config');

const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');

const {mongoose} = require("./db/mongoose");
const {ObjectID} = require('mongodb');
const {todo} = require("./models/todo");
const {user} = require("./models/user");
const {authenticate} = require("./middleware/authenticate");


const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const toDo= new todo({
       text: req.body.text 
    });
    
    toDo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
        });
});


app.get('/todos', (req, res) => {
    
    todo.find().then((todo) => {
        res.send({todo});  
    }, (e) => {
        res.status(400).send(e);
    });
});


app.get('/todos/:id', (req, res) => {
    
    if(!ObjectID.isValid(req.params.id)){ 
        res.status(404).send("ID not valid");
    }
    
    todo.findById(req.params.id).then((todo) => {
        if(!todo){
            return res.status(404).send("ID not found in database"); 
        }
          
        res.send({todo});    
    }).catch((e) => {
        res.status(400).send();
    });
});



app.delete('/todos/:id', (req, res) => {
    
    if(!ObjectID.isValid(req.params.id)){ 
        res.status(404).send("ID not valid");
    }

    todo.findByIdAndRemove(req.params.id).then((todo) => {
        if(!todo){
          return res.status(404).send("ID not found in database");     
        }
        
        res.send({todo})
    }).catch((e) => {
        res.status(400).send();
    });
});


app.patch('/todos/:id', (req, res) => {

    var body =_.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(req.params.id)){ 
        res.status(404).send("ID not valid");
    }
    
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;    
    }
    
    todo.findByIdAndUpdate(req.params.id, {$set: body}, {new: true}).then((todo) => {
        if(!todo){
            return res.status(404).send("ID not found");
        }
        res.send({todo});
        
    }).catch((e) => {
        res.status(400).send("Error");
    })
});


app.post('/users', (req, res) => {
    
    var body =_.pick(req.body, ['email', 'password']); //Using the pick method
    
    const newUser= new user(body);
    
    
    newUser.save().then((doc) => {
        return doc.generateAuthToken();
//        res.send(user);
    }).then((token) => {
        res.header('x-auth', token).send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
});



app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.listen(port, () => {
    console.log("Started up on port", port);
});

module.exports = {app};




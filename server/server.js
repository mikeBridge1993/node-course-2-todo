const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require("./db/mongoose");
const {ObjectID} = require('mongodb');
const {todo} = require("./models/todo");
const {user} = require("./models/user");

const app = express();
const port = process.env.PORT || 3000;

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
    
    todo.find().then((todos) => {
        res.send({todos});  
    }, (e) => {
        res.status(400).send(e);
    });
});


app.get('/todos/:id', (req, res) => {
    
    if(!ObjectID.isValid(req.params.id)){ 
        res.status(404).send("ID not valid");
    }
    
    todo.findById(req.params.id).then((todos) => {
        if(!todo){
            return res.status(404).send("ID not found in database"); 
        }
        
        res.send({todos});    
    }).catch((e) => {
        res.status(400).send('Error');
    });
});



app.delete('/todos/:id', (req, res) => {
    
    if(!ObjectID.isValid(req.params.id)){ 
        res.status(404).send("ID not valid");
    }

    todo.findByIdAndRemove(req.params.id).then((removedTodo) => {
        if(!removedTodo){
          return res.status(404).send("ID not found in database");     
        }
        
        res.send(removedTodo)
    }).catch((e) => {
        res.status(400).send(e);
    });
});


app.listen(port, () => {
    console.log("Started up on port", port);
});

module.exports = {app};




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
    console.log(process.env.PORT);

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
        if(todos){
            res.send({todos});     
        }else{
            res.status(404).send("ID not found in database");
        }   
    }, (e) => {
        res.status(400).send(e);
    });
});


app.listen(port, () => {
    console.log("Started up on port", port);
});

module.exports = {app};




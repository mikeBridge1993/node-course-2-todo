require('./config/config');

const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const {mongoose} = require("./db/mongoose");
const {ObjectID} = require('mongodb');
const {todo} = require("./models/todo");
const {user} = require("./models/user");
const {authenticate} = require("./middleware/authenticate");
const bcrypt = require('bcryptjs');

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





app.post('/users/login', (req, res) => {
    
    var email  = req.body.email;
    var password = req.body.password; //or use the pick method

//    user.find({email}).then((doc) => { //andrew preferd to create another model method for this, so this was copied for find by credentials
//        
//        bcrypt.compare(password, doc[0].password, (err, resp) => {
//            console.log(resp);
//            if(resp == true){
//                res.status(200).send(doc);
//            } else {
//                res.status(404).send(err);
//            }
//        });
//    
//    }, (e) => {
//        res.status(400).send(e);
//    });
    
    user.findByCredentials(email, password).then((doc) => {
        
       return doc.generateAuthToken().then((token) => { //return to keep chain alive, if err chain gets it. also, were 
             res.header('x-auth', token).send(doc);
        });
        
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
       res.status(200).send(); 
    }, () => {
        res.status(400).send();
    });
});
app.listen(port, () => {
    console.log("Started up on port", port);
});

module.exports = {app};




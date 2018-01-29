const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/todoapp', (err, client) => {
    if (err) {
      return console.log('Unable to connect');  
    };
    
    const db = client.db('todoapp');
    
    console.log('Connected to MongoDB server');
    
    db.collection('Todos').insertOne({
        text: 'Ligar para a Sofia Mota',
        completed: false
    }, (err, result) => {
        if(err){
           return console.log('Unable to insert todo', err); 
        }
        console.log(JSON.stringify(result.ops, undefined, 2));      
    });
    
     db.collection('Users2').insertOne({
        name: "Miguel Ponte",
        age:26,
        location: "Ponta Delgada",
        completed: true
    }, (err, result) => {
        if(err){
           return console.log('Unable to insert todo', err); 
        }
        console.log(JSON.stringify(result.ops, undefined, 2));      
    });
    
    
    db.collection('Users2').insertOne({
        name: "Miguel Ponte",
        age:27,
        location: "Ponta Delgada",
        completed: false
    }, (err, result) => {
        if(err){
           return console.log('Unable to insert todo', err); 
        }
        console.log(JSON.stringify(result.ops, undefined, 2));      
    });
    
    client.close()        
});
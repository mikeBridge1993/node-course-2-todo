const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoapp', (err, client) => {
    if (err) {
      return console.log('Unable to connect');  
    };
    
    const db = client.db('todoapp');
    
    console.log('Connected to MongoDB server');
    
    db.collection('Todos').findOneAndUpdate({text: "PMO"}, {$set :{completed: "faileddd"}}, {returnOriginal: false}).then((result) => {
        console.log(result);
    }); 
    
    
    db.collection('Todos').find().toArray().then((docs) => {
        
        console.log(JSON.stringify(docs, undefined, 2));
    });
    
//    client.close()        
});

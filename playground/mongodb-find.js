const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoapp', (err, client) => {
    if (err) {
      return console.log('Unable to connect');  
    };
    
    const db = client.db('todoapp');
    
    console.log('Connected to MongoDB server');
    
    db.collection('Users2').find({
        name: "Jen Ponte"
    }).toArray().then((docs) => {
        console.log('users');
        console.log(JSON.stringify(docs, undefined, 2));
    });
    
    client.close()        
});

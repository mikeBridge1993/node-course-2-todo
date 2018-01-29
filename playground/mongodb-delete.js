const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoapp', (err, client) => {
    if (err) {
      return console.log('Unable to connect');  
    };
    
    const db = client.db('todoapp');
    
    console.log('Connected to MongoDB server');
    
    db.collection('Users').deleteOne({name: "Miguel Ponte"}).then((result) => {
        
    }); 
    
    db.collection('Users').deleteMany({name: "Miguel Ponte"}).then((result) => {
        
    });
    
    db.collection('Users').findOneAndDelete({name: "Jasmim Ponte"}).then((result) => {
        console.log(result);
   }); //Returns deleted object in result variable
    
    db.collection('Users').find().toArray().then((docs) => {
        
        console.log(JSON.stringify(docs, undefined, 2));
    });
    
    
    
//    client.close()        
});

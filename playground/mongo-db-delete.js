// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, 
    (error, client) => {
        if (error) {
            return console.log('Unable to connect to MongoDB server.');
        }
        console.log('Connected to MongoDB server.');
        
        const db = client.db('TodoApp');

        // deleteMany
        // db.collection('Todos').deleteMany({text: 'test'}).then((result) => {
        //     console.log(result);
        // });

        // deleteOne
        // db.collection('Todos').deleteOne({text: 'test'}).then((result) => {
        //         console.log(result);
        //     });

        // findOneAndDelete
        db.collection('Todos').findOneAndDelete({_id: new ObjectID('5bfecac21006e9185bca22b3')}).then((result) => {
            console.log(result);
        });

        client.close();
    }
);
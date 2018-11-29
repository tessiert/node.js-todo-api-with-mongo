// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, 
    (error, client) => {
        if (error) {
            return console.log('Unable to connect to MongoDB server.');
        }
        console.log('Connected to MongoDB server.');
        // const db = client.db('TodoApp');

        // // Create collection and insert one document
        // db.collection('Todos').insertOne({
        //     text: 'Something to do',
        //     completed: 'false'
        // }, (error, result) => {
        //     if (error) {
        //         console.log('Unable to insert todo.', error);
        //     }

        //     console.log(JSON.stringify(result.ops, undefined, 2));
        // });

        const db = client.db('Users');

        db.collection('Users').insertOne({
            name: 'Trace',
            age: 48,
            location: 'Tijeras'
        }, (error, result) => {
            if (error) {
                console.log('Unable to insert todo document.', error);
            }

            console.log(JSON.stringify(result.ops, undefined, 2));
            console.log(result.ops[0]._id.getTimestamp());
        });

        client.close();
    }
);
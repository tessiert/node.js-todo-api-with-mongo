// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, 
    (error, client) => {
        if (error) {
            return console.log('Unable to connect to MongoDB server.');
        }
        console.log('Connected to MongoDB server.');
        
        const db = client.db('TodoApp');

        // db.collection('Todos').find({
        //     _id: new ObjectID('5bfecac21006e9185bca22b3')
        // }).toArray().then((docs) => {
        //     console.log('Todos:');
        //     console.log(JSON.stringify(docs, undefined, 2));
        // }, (error) => {
        //     console.log('Unable to fetch todos', error);
        // });

        // db.collection('Todos').find().count().then((count) => {
        //     console.log(`Todos count: ${count}`);
        // }, (error) => {
        //     console.log('Unable to fetch todos', error);
        // });

        db.collection('Todos').find({
            text: 'Something to do'
        }).toArray().then((docs) => {
            console.log('Todos:');
            console.log(JSON.stringify(docs, undefined, 2));
        }, (error) => {
            console.log('Unable to fetch todos', error);
        });

        client.close();
    }
);
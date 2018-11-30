// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, 
    (error, client) => {
        if (error) {
            return console.log('Unable to connect to MongoDB server.');
        }
        console.log('Connected to MongoDB server.');
        
        const db = client.db('TodoApp');

        // findOneAndUpdate
        db.collection('Todos').findOneAndUpdate({_id: new ObjectID('5c007ad0587cd0f3874b98e0')},
            {
                $set: {
                    text: 'New Text'
                },
                $inc: {
                    count: 1
                }
            },
            {
                returnOriginal: false
            }
        ).then((result) => {
            console.log(result);
        });


        client.close();
    }
);
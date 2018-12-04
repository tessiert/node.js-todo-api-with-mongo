const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000; // PORT var needed for heroku deployment

app.use(bodyParser.json());

app.post('/todos/', (request, response) => {
    var todo = new Todo({
        text: request.body.text
    });

    todo.save().then((doc) => {
        return response.send(doc);
    }, (error) => {
        return response.status(400).send(error);
    });
});

app.get('/todos/', (request, response) => {
    Todo.find().then((todos) => {
        return response.send({todos});
    }, (error) => {
        return response.status(400).send(error);
    });
});

app.get('/todos/:id', (request, response) => {
    var id = request.params.id;

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }
        return response.send({todo});
    }).catch((error) => {
        return response.status(400).send();
    });
});

app.delete('/todos/:id', (request, response) => {
    var id = request.params.id;

    if (!ObjectID.isValid(id)) {
        return response.status(400).send();
    }
    Todo.findByIdAndDelete(id).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }
        return response.send(todo);
    }).catch((error) => {
        return response.status(400).send();
    });
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = {app};



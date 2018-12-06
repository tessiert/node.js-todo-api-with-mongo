require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT; // PORT var needed for heroku deployment

app.use(bodyParser.json());

// todos routes
app.post('/todos/', (request, response) => {
    var todo = new Todo({
        text: request.body.text
    });

    todo.save().then((doc) => {
        return response.send(doc);
    }).catch((error) => {
        return response.status(400).send(error);
    });
});


app.get('/todos/', (request, response) => {
    Todo.find().then((todos) => {
        return response.send({todos});
    }).catch((error) => {
        return response.status(400).send(error);
    });
});


app.get('/todos/:id', (request, response) => {
    var id = request.params.id;

    if (!ObjectID.isValid(id)) {
        return response.status(400).send();
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
        return response.send({todo});
    }).catch((error) => {
        return response.status(400).send();
    });
});


app.patch('/todos/:id', (request, response) => {
    var id = request.params.id;
    // Constrain which properties user is allowed to modify
    var body = _.pick(request.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return response.status(400).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }

        return response.send({todo});
    }).catch((error) => {
        return response.status(400).send();
    })
});


// users routes
app.post('/users/', (request, response) => {
    var body = _.pick(request.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        return response.header('x-auth', token).send(user);
    }).catch((error) => {
        return response.status(400).send(error);
    });
});


app.get('/users/me', authenticate, (request, response) => {
    response.send(request.user);
});

// web server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = {app};



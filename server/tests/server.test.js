const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const test_todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}];

// Before each test, reset db to contain only those docs in test_todos array
beforeEach((done) => {
    Todo.deleteMany({}).then(() => {
        Todo.insertMany(test_todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((response) => {
                expect(response.body.text).toBe(text);
            })
            .end((error, response) => {
                if (error) {
                    return done(error);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((error) => done(error));
            });
    });

    it('should not create a todo with invalid body data', (done) => {
        var text = "";

        request(app)
            .post('/todos')
            .send({text})
            .expect(400)
            .end((error, response) => {
                if (error) {
                    return done(error);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((error) => done(error));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((response) => {
                expect(response.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${test_todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((response) => {
            expect(response.body.todo.text).toBe(test_todos[0].text);
        })
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var new_id = new ObjectID();

        request(app)
            .get(`/todos/${new_id.toHexString}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for invalid IDs', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});


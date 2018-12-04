const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} =require('./../server/models/user');

var id = new ObjectID('5c06e8c479e2362d7b663b39');

// Remove all items in db
// Todo.deleteMany({}).then((result) => {
//     console.log(result);
// });

// Remove by ID
Todo.deleteOne({_id: id}).then((todo) => {
    console.log(todo);
});
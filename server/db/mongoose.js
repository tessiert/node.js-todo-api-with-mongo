const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// Connect to env. var. if on Heroku, or local instance if in dev.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {useNewUrlParser: true});

module.exports = {mongoose};
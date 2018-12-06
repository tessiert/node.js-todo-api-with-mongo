const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{value} is not a valid email address.'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// Custom middleware to run code before a 'save' event on an instance of User
UserSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(user.password, salt, (error, hashedPassword) => {
                user.password = hashedPassword;
                next();
            });
        });
    }
    else {
        next();
    }
});


// Create model methods
UserSchema.statics.findByToken = function (token) {
    var User = this;    // 'this' binding is the model
    var decoded;        // initially 'undefined' since jwt throws error if verify fails

    try {
        decoded = jwt.verify(token, 'abc123');
    }
    catch (error) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,         // quotes optional for _id, but required
        'tokens.token': token,      // for keys with '.'
        'tokens.access': 'auth'
    });
};

// Create instance methods
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};


UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({access, token});

    // return value rather than promise, becomes argument of success case in next 'then' call
    return user.save().then(() => {
        return token;
    });
};


// Create User data model from schema
var User = mongoose.model('User', UserSchema);

module.exports = {User};
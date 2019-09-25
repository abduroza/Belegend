const mongoose      = require("mongoose");
const Schema        = mongoose.Schema;
var validate        = require('mongoose-validator')
var uniqueValidator = require('mongoose-unique-validator');

var usernameValidator = [
    validate({
      validator: 'isLength',
      arguments: [6, 30],
      message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
    })
  ]

const usersSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: usernameValidator
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    user_type: {
        type: String,
        enum : ['customer','merchant'],
        default: 'customer'
    },
    list_products: [{
        type  : Schema.Types.ObjectId, 
        ref     : 'Product'
    }],
    exp_token: { 
      type: Date
    },
    token: {
        type: String
    },
    is_verified: {
        type: Boolean,
        default: false,
        required: true
    },
    date_input: { 
        type: Date, 
        default: Date.now 
      }
}, { collection: 'users' });

usersSchema.plugin(uniqueValidator); 

var Users = mongoose.model("Users", usersSchema);
module.exports = Users;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var userSchema = new Schema({
	name:{
		type: String,
		required: true,
		trim: true,
		minlength: 2
	},
	email:{
		type: String,
		required: true,
		trim: true,
		minlength: 8,
		unique: true,
		validate: {
			validator: (value) => {
			 	return validator.isEmail(value);
			},
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 8
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
	}] ,
	age:{
		type: Number,
		required: true,
		minlength: 1,
		trim: true
	}
});

userSchema.methods.toJSON = function  () {
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject, ['_id', 'name', 'email'])
}

userSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

	user.tokens.push({access, token});

	return user.save().then(() => {
		return token;
	});
};

var User = mongoose.model('User', userSchema);

// var seb = new User({
// 	name : 'Seb',
// 	email: 'titan9389@me.com',
// 	age: 24
// });

// seb.save().then((doc) => {
// 	console.log('Added user', doc);
// }, (e) => {
// 	console.log('Unable to Add', e);
// });

module.exports = {User};
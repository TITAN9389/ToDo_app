var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

var Todo = mongoose.model('Todo', todoSchema)

// var newTodo = new Todo({
//     text: 'Baking Potatos'
// });

// newTodo.save().then((doc) => {
//     console.log('Saved todo', doc);
// }, (e) => {
//     console.log('Unable to save', e);
// });

module.exports = {Todo};
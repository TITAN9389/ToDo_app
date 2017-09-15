const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user')

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.post('/users', (req, res) => {
    var user = new User({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    });

    user.save().then((usr) => {
        res.send(usr);
    }, (e) => {
        res.status(401).send(e)
    });
});


app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos })
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/users', (req, res) => {
    User.find().then((users) => {
        res.send({ users })
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    
    if (!ObjectID.isValid(id)) { // Validate ID using isValid
        return res.status(404).send(); // 404 - sending back empty send
    }
    Todo.findById(id).then((todo) => {  // findById
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((e) => {
        res.status(404).send();
    });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id; // get the id
  
    if (!ObjectID.isValid(id)){   // validate the id --> not valid? return 404
      return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) => { // remove todo by Id
      if (!todo){
       return res.status(404).send(); // if no doc , send 404
      }
        res.status(200).send(todo); // if doc , send doc and 200
    }).catch((e) => {
    res.status(400).send();
    }); // error  400 with empty body
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set:body},{new:true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});


app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = { app };
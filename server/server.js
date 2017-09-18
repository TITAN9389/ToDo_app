// require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// =============================TODOs=============================

// ADD
app.post('/todos', (req, res) => {
    var body = _.pick(req.body, ['text']);
    var todo = new Todo(body);

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

// FETCH
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos })
    }, (e) => {
        res.status(400).send(e);
    });
});

// FETCH BY ID
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
        res.status(400).send();
    });
});

// DELETE
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

// UPDATE
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


// =================================USERs===============================
// ADD USER
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['name','email','password','age']);
    var user = new User(body);

    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

// FETCH ALL USERS
app.get('/users', (req, res) => {
    User.find().then((users) => {
        res.send({ users })
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET USER BY ID                              // DONT USE WITH USERS/ME !!
// app.get('/users/:id', (req, res) => {
//   var id = req.params.id;

//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }
//   User.findById(id).then((user) => {
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send({ user });
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });


// GET USER WITH AUTH TOKEN
app.get('/users/me' , authenticate, (req ,res) => {
  res.send(req.user);
});


app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = { app };
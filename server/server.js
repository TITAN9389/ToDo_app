var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user')

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
    res.send({todos})
  }, (e) => {
    res.status(400).send(e);
  });
}); 

app.get('/users' ,(req, res) => {
  User.find().then((users) => {
    res.send({users})
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id' , (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  // Validate ID using isValid
  // 404 - sending back empty send

  // findById
  Todo.findById(id).then((todo) => {
    if(!todo){
    return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(404).send();
  });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
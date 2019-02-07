var express = require('express')
var bodyParser = require('body-parser')
var _ = require('underscore')
var bcrypt = require('bcrypt')
var db = require('./db.js')
var app = express()
var PORT = process.env.PORT || 3000
var todos = []
var todoNextId = 1

// var todos = [{
//     ID: 1,
//     Description: 'go to market ',
//     Completed: false
// },
// {
//     ID: 2,
//     Description: 'wash cloths',
//     Completed: false
// },
// {
//     ID: 3,
//     Description: 'eat food and have drinks',
//     Completed: true
// }];
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('todo api root')
})
app.get('/todos', function (req, res) {
  var query = req.query
  var where = {}

  if (query.hasOwnProperty('completed') && query.completed === 'true') {
    where.completed = true
  } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
    where.completed = false
  }

  if (query.hasOwnProperty('q') && query.q.length > 0) {
    where.description = {
      $like: '%' + query.q + '%'
    }
  }

  db.todo
    .findAll({ where: where })
    .then(todo => {
      if (todo == []) {
        // console.log(typeof todo);
        // console.log(todo);
        // console.log(typeof todo);
        res.status(404).json(e)
      } else {
        res.send(todo)
      }
    })
    .catch(e => res.status(500).json(e))

  //   var filteredTodos = todos

  //   if (
  //     queryParams.hasOwnProperty('completed') &&
  //     queryParams.completed === 'true'
  //   ) {
  //     filteredTodos = _.where(filteredTodos, { completed: true })
  //   } else if (
  //     queryParams.hasOwnProperty('completed') &&
  //     queryParams.completed === 'false'
  //   ) {
  //     filteredTodos = _.where(filteredTodos, { completed: false })
  //   }

  //   if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
  //     filteredTodos = _.filter(filteredTodos, function (todo) {
  //       return (
  //         todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1
  //       )
  //     })
  //   }
  //   res.json(filteredTodos)
})

app.get('/todos/:id', function (req, res) {
  var todoid = parseInt(req.params.id, 10)

  db.todo
    .findById(todoid)
    .then(todo => {
      console.log('row found')
      res.json(todo.toJSON())
    })
    .catch(e => res.status(404).json(e))
})
//   var obj = _.findWhere(todos, { id: todoid })
// var obj;
// for(i = 0; i < todos.length; i++) {
//     if(todos[i].id === todoid) {
//          obj = todos[i];
//     }
// }
//   if (typeof obj === 'undefined') {
//     res.status(404).send()
//   } else res.json(obj)
// })

app.post('/todos', function (req, res) {
  var body = _.pick(req.body, 'description', 'completed')
  // body.description = body.description.trim()

  db.todo
    .create(body)
    .then(todo => {
      console.log('row inserted')
      res.json(todo.toJSON())
    })
    .catch(e => res.status(400).json(e))

  // console.log('description ' + body.description);

  // if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
  //     return res.status(400).send();
  // }
  // body.description = body.description.trim();

  // body.id = todoNextId++;
  // todos.push(body);
  // res.json(body);
})

app.delete('/todos/:id', function (req, res) {
  var todoid = parseInt(req.params.id, 10)

  db.todo
    .destroy({
      where: {
        id: todoid
      }
    })
    .then(todo => {
      if (!todo) {
        res.status(404).json({
          error: 'row not found'
        })
      } else {
        res.status(204).send()
      }
    })
    .catch(e => res.status(500).send())
  //   var obj = _.findWhere(todos, { id: todoid })

  //   if (typeof obj === 'undefined') {
  //     res.status(404).send()
  //   } else todos = _.without(todos, obj)
  //   res.json(obj)
})

app.put('/todos/:id', function (req, res) {
  var body = _.pick(req.body, 'description', 'completed')
  var todoid = parseInt(req.params.id, 10)
  //   var obj = _.findWhere(todos, { id: todoid })
  let attributes = {}

  //   if (!obj) {
  //     return res.status(404).send()
  //   }

  if (body.hasOwnProperty('completed')) {
    attributes.completed = body.completed
  }
  //   else if (body.hasOwnProperty('completed')) {
  //     return res.status(404).send()
  //   }

  if (body.hasOwnProperty('description')) {
    attributes.description = body.description
  }
  //   else if (
  //     body.hasOwnProperty('description') &&
  //     _.isString(body.description) &&
  //     body.description.trim().length > 0
  //   ) {
  //     return res.status(404).send()
  //   }
  //   _.extend(obj, validAttributes)
  //   res.json(obj)

  db.todo.findById(todoid).then(
    function (todo) {
      if (todo) {
        todo.update(attributes).then(
          function (todo) {
            res.json(todo.toJSON())
          },
          function (e) {
            res.status(400).json(e)
          }
        )
      } else {
        res.status(404).send()
      }
    },
    function () {
      res.status(500).send()
    }
  )
})

app.post('/users', function (req, res) {
  var body = _.pick(req.body, 'email', 'password')
  //   body.email = body.email.trim()
  body.password = body.password.trim()

  db.users
    .create(body)
    .then(todo => {
      console.log('row inserted')
      res.json(todo.toPublicJSON())
    })
    .catch(e => res.status(400).json(e))

  // console.log('description ' + body.description);

  // if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
  //     return res.status(400).send();
  // }
  // body.description = body.description.trim();

  // body.id = todoNextId++;
  // todos.push(body);
  // res.json(body);
})
app.post('/users/login', function (req, res) {
  var body = _.pick(req.body, 'email', 'password')
  //   body.email = body.email.trim()
  // body.password = body.password.trim()
  

  db.users.authenticate(body).then(
    user => {
      var token = user.generateToken('authentication')
      if (token) {
        res.header('awth', token).json(user.toPublicJSON())
      } else {
        res.status(401).send()
      }
    },
    () => res.status(401).send()
  )

  // db.users
  //   .findOne({
  //     where: {
  //       email: body.email
  //     }
  //   })
  //   .then(
  //     useremail => {
  //       if (!useremail || !bcrypt.compareSync(body.password, useremail.get('password_hash'))) {
  //         return res.status(401).send();
  //       }

  //       res.json(useremail.toPublicJSON())
  //     },
  //     e => res.res.status(500).json(e)
  //   )
})

db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log('express port ' + PORT)
  })
})

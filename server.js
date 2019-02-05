var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

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
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('todo api root');
});
app.get('/todos', function (req, res) {
    var queryParams = req.query;
    var filteredTodos = todos;


    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, { completed: true });
    } else if ((queryParams.hasOwnProperty('completed') && queryParams.completed === 'false')) {
        filteredTodos = _.where(filteredTodos, { completed: false });
    }



    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
        filteredTodos = _.filter(filteredTodos, function (todo) {
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
        });
    }
    res.json(filteredTodos);
});








app.get('/todos/:id', function (req, res) {

    var todoid = parseInt(req.params.id, 10);
    var obj = _.findWhere(todos, { id: todoid });
    // var obj;
    // for(i = 0; i < todos.length; i++) {
    //     if(todos[i].id === todoid) {
    //          obj = todos[i];
    //     }
    // }
    if (typeof obj == 'undefined') {
        res.status(404).send();
    } else
        res.json(obj);
});

app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    console.log('description ' + body.description);

    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }
    body.description = body.description.trim();

    body.id = todoNextId++;
    todos.push(body);
    res.json(body);

});

app.delete('/todos/:id', function (req, res) {
    var todoid = parseInt(req.params.id, 10);
    var obj = _.findWhere(todos, { id: todoid });


    if (typeof obj == 'undefined') {
        res.status(404).send();
    } else
        todos = _.without(todos, obj);
    res.json(obj);

});

app.put('/todos/:id', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    var todoid = parseInt(req.params.id, 10);
    var obj = _.findWhere(todos, { id: todoid });
    let validAttributes = {};

    if (!obj) {
        return res.status(404).send();
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(404).send();
    }

    if (body.hasOwnProperty('description') && _.isBoolean(body.completed)) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('completed') && _.isString(body.description) && body.description.trim().length > 0) {
        return res.status(404).send();
    }
    _.extend(obj, validAttributes);
    res.json(obj);


});

db.sequelize.sync().then( function () {
    app.listen(PORT, function () {
        console.log('express port ' + PORT);
    });
});


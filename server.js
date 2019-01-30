var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
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

app.get('/', function(req, res) {
    res.send('todo api root');
});
app.get('/todos', function(req, res) {
    res.json(todos);
});

app.get('/todos/:id', function(req, res) {
    var todoid = parseInt(req.params.id, 10);
    var obj = _.findWhere(todos, {id: todoid});
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
    var body = req.body;
      
    console.log('description ' + body.description);

    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

    body.id = todoNextId ++;
    todos.push(body);
    res.json(body);

});

app.listen(PORT, function () {
    console.log('express port' + PORT);
});
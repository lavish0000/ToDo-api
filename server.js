var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
    ID: 1,
    Description: 'go to market',
    Completed: false
},
{
    ID: 2,
    Description: 'wash cloths',
    Completed: false
},
{
    ID: 3,
    Description: 'eat food',
    Completed: true
}];

app.get('/', function(req, res) {
    res.send('todo api root');
});
app.get('/todos', function(req, res) {
    res.json(todos);
});

app.listen(PORT, function () {
    console.log('express port' + PORT);
});
var Sequelize = require('sequelize');
const mysql = require('mysql');
var sequelize = new Sequelize('demodb', 'root', 'emilence', {
    'dialect': 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
    
      // SQLite only
      
    
      // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
      operatorsAliases: false
});
//console.log(typeof require('sequelize'));

var  Todo = sequelize.define('todo', {
    descriptionS: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [2, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

sequelize.sync({
    //force: true
}).then(function () {
    console.log('eveything is synced');

    Todo.create({
        descriptionS: 'walking my dog',
        completed: false
    }).then(function(){
        return Todo.create({
            descriptionS: 'eat food'
        });
    }).then(function() {
        //return Todo.findById(1);
        return Todo.findAll({
            where: {
                descriptionS: {
                    $like: '%eat%'
                }
            }
        });
    }).then(function (todo) {
        if(todo) {
            todo.forEach(function (todo) {
                console.log(todo.toJSON());
            });
            
        } else {
            console.log('todo not found');
        }
    });






    // return Todo.findById(3).then(function (todo) {
    //     console.log(todo.toJSON());
    // }).catch( function () {
    //     console.log('id not found');
    // });
});
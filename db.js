var Sequelize = require('sequelize');
const mysql = require('mysql');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    });
} else {
    sequelize = new Sequelize('todo-api', 'root', 'emilence', {
    'dialect': 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
    
      // SQLite only
      
    
      // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
      //operatorsAliases: false
});
}






var db = {};

db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;
module.exports = function (sequelize, DataTypes) {
   return sequelize.define('todo', {
        descriptionS: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 250]
            }
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
};
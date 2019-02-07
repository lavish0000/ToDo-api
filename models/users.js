var bcrypt = require('bcrypt')
var _ = require('underscore')
module.exports = function (sequelize, DataTypes) {
  var users = sequelize.define(
    'users',
    {
      email: {
        unique: true,
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      salt: {
        type: DataTypes.STRING
      },
      password_hash: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        validate: {
          len: [7, 100]
        },
        set: function (value) {
          var salt = bcrypt.genSaltSync(10)
          var hashedPassword = bcrypt.hashSync(value, salt)

          this.setDataValue('password', value)
          this.setDataValue('salt', salt)
          this.setDataValue('password_hash', hashedPassword)
        }
      }
    },
    {
      hooks: {
        beforeValidate: function (user, option) {
          if (typeof user.email === 'String') {
            this.user.email = user.email.toLowerCase()
          }
        }
      },
      classMethods: {
        authenticate: function (body) {
          return new Promise(function (resolve, reject) {
            users
              .findOne({
                where: {
                  email: body.email
                }
              })
              .then(
                useremail => {
                  if (
                    !useremail ||
                    !bcrypt.compareSync(
                      body.password,
                      useremail.get('password_hash')
                    )
                  ) {
                    return reject()
                  }

                  resolve(useremail)
                },
                () => reject()
              )
          })
        }
      },
      instanceMethods: {
        toPublicJSON: function () {
          var json = this.toJSON()
          return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt')
        }
      }
    }
  )
  return users
}

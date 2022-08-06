'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A name is required'
        },
        notEmpty: {
          msg: 'Please provide a name'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'The username you entered already exists'
      },
      validate: {
        notNull: {
          msg: 'A username is required'
        },
        notEmpty: {
          msg: 'Please provide a username'
        }
      }
    },
    emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg:'The email you entered already exists'
        },
        validate: {
          notNull: {
            msg: 'An email is required'
          },
          isEmail: {
            msg: 'Please provide a valid email address'
          }
        }
      },
    password: {
      type: DataTypes.VIRTUAL,  
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required'
        },
        notEmpty: {
          msg: 'Please provide a password'
        },
        len: {
          args: [8, 20],
          msg: 'The password should be between 8 and 20 characters in length'
        }
      }
    },
    confirmedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        if ( val === this.password ) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('confirmedPassword', hashedPassword);
        }
      },
      validate: {
        notNull: {
          msg: 'Both passwords must match'
        }
      }
    }
  }, { sequelize });

  User.associate = (models) => {
    /*Add a one-to-many association between the User and Movie models. Include a call to the Person model's hasMany() method, 
    passing in a reference to the Movie model:
    This tells Sequelize that a person can be associated with one or more (or "many") movies.*/
    User.hasMany(models.Course, { 
      as: 'userId', //alias
      foreignKey: {
      fieldName: 'userId',
      allowNull: false,
    },
  });
  };

  return User;
};
'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    estimatedTime: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      materialsNeeded: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  }, { sequelize });

  Course.associate = (models) => {
    /*Add a one-to-one association between the Course and User models. Include a call to the Movie model belongsTo() 
    method passing in a reference to the Person model:
    This tells Sequelize that a movie can be associated with only one person.
 */
Course.belongsTo(models.User, { 
  /*The value of the as property is the alias that we want to use for this association. 
  Let's also keep the Person model association in sync with the Movie model association.*/


  as: 'userId', //alias
  foreignKey: {
  fieldName: 'userId',
  allowNull: false,
 },
});
  };

  return Course;
};

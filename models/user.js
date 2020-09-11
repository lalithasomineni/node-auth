const Sequelize = require("sequelize");
const db = require("../config/database");

const User = db.define("user", {
  name: {
    type: Sequelize.STRING,
     minlength: 5,
    maxlength: 50,
  },
  email: {
    type: Sequelize.STRING,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },

  password: {
    type: Sequelize.STRING,
     minlength: 5,
    maxlength: 50,
  }
});

User.sync().then(() => {
  console.log("table created");
});
module.exports = User;

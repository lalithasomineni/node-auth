const express = require("express");
const db = require("./config/database");
const app = express();
const passport = require('passport');
const bodyParser = require("body-parser");
const auth = require("./middlewares/auth");
const port =  7000;

app.use(bodyParser.json());
app.use("/",require("./routes/user"));
app.use(passport.initialize());
app.use(passport.session());

require('./middlewares/auth')(passport);

db.authenticate()
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`am connected at port ${port}`);
});
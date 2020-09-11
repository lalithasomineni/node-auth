const express = require("express");
const db = require("./config/database");
const app = express();
const bodyParser = require("body-parser");
const port =  7000;

app.use(bodyParser.json());
app.use("/",require("./routes/user"));


db.authenticate()
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`am connected at port ${port}`);
});
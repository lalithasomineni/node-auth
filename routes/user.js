const express = require("express");
const router = express.Router();
const db = require("../config/database");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");



router.post("/signup", async (req, res) => {
  const user = await new User({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password
  });
  const salt = await bcrypt.genSalt(14)
    user.password = await bcrypt.hash(user.password,salt);
    user = await user.save()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/login", async (req, res) => {
  const user =  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (!user) {
      return res.status(404).send('User Not Found.');
    }
 
    var passwordIsValid = bcrypt.compare(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
    }
    
    var token = jwt.sign({ id: user.id }, process.env.APP_SECRET, {
      expiresIn: 86400 // expires in 24 hours
    });
    
    res.status(200).send({ auth: true, Token: token });
    
  }).catch(err => {
    res.status(500).send('Error -> ' + err);
  });
 
});




module.exports = router;
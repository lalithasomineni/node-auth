const express = require("express");
const router = express.Router();
const db = require("../config/database");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const passport = require('passport');



const userAuth = passport.authenticate("jwt", { session: false });
router.get("/",userAuth,(req,res)=>{
  User.findAll().then(result=>{
    res.send(result);
  }).catch(err=>{
    console.log(err);
  })
})

router.get("/:id",userAuth,(req,res)=>{
  User.findOne({where:{id:req.params.id}})
  .then(result=>{
    res.send(result);
  }).catch(err=>{
    console.log(err);
  })
})



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

router.post("/login", (req, res) => {
  const user =  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
     let isMatch = bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (isMatch) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user.id
            },
            process.env.APP_SECRET,
            {
                expiresIn: "7 days"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
     });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  })

router.put("/:id",userAuth, (req, res) => {
  const _id = req.params.id;
  User.findOne({
    where: { id: _id },
  })
    .then((result) => {
      result
        .update({
          name: req.body.name,
          email:req.body.email
        })
        .then((update) => {
          console.log(update);
          res.json(update);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});


router.delete("/:id",userAuth, (req, res) => {
  const _id = req.params.id;
  User.destroy({
    where: { id: _id },
  })
    .then((result) => {
      res.json({ status: "deleted succefully", result: result });
      console.log("deleted succesfully");
    })
    .catch((err) => {
      console.log(err);
    });
});


module.exports = router;
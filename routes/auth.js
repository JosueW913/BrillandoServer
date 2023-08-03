var express = require("express");
var router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const isAuthenticated = require("../middleware/isAuthenticated");

const User = require("../models/User");

const saltRounds = 10;


router.post("/signup", (req, res, next) => {
    console.log("signing up")
  const { email, password, fullName, username  } = req.body;

  if (email === "" || password === "" || username === "") {
    res.status(400).json({ message: "Provide email, password and username" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // Use regex to validate the password format
  // const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (!passwordRegex.test(password)) {
  //   res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
  //   return;
  // }


  User.findOne({ email })
    .then((foundUser) => {

      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      User.create({ email, password: hashedPassword, fullName, username })
        .then((createdUser) => {

          const { email, _id, fullName, username  } = createdUser;

          const payload = { email, _id, fullName, username };

          const authToken = jwt.sign(payload, process.env.SECRET, {
            algorithm: "HS256",
            expiresIn: "6h",
          });
  
          res.status(200).json({ authToken });
        })
        .catch((error) => {
            if (error.code === 11000) {
                console.log(" Username and email need to be unique. Either username or email is already used. ")
                res.status(500).json({message: "Username and email need to be unique. Either username or email is already used."})
            } else {
                console.log(error)
                next(error)
            }
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {

        res.status(401).json({ message: "User not found." });
        return;
      }

      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {

        const { email, _id, fullName, username} = foundUser;

        const payload = { email, _id, fullName, username };

        const authToken = jwt.sign(payload, process.env.SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        res.status(200).json({ authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => res.status(500).json({ message: "Internal Server Error" }));
});

router.get("/verify", isAuthenticated, (req, res, next) => {

  console.log("req.user", req.user);

  res.status(200).json(req.user);
});

module.exports = router;
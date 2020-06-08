const express = require("express");
const app = express();
const hashJS = require("hash.js");
const parser = require("body-parser");
const jwt = require("jsonwebtoken");
const {connectionMysql} = require('../config/connection.config');
const { userQueryLogin } = require("../DAO/user.dao");

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

app.post("/login", (req, res) => {
  let {
    body: { email, password },
  } = req;
  connectionMysql.query(
      userQueryLogin, 
      [ email, hashJS.sha256().update(password).digest('hex') ], 
      (err, [validUser], fields) => {
        if(err) res.status(500).json(err);
        if(!validUser) return res.status(401).json('{ message: "user and password are invalid" }');
        const {name: username} = validUser;
        res.json({
          ok: true,
          username,
          token: jwt.sign({
            validUser,
          },process.env.SEED,
          { expiresIn: 60*60 }
        )
        })
      });
});

module.exports = app;



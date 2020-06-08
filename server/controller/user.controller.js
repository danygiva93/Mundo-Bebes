const express = require('express');
const app = express();
const { verifytoken } = require('../middleware/verifyToken.middleware');
const hashJS = require('hash.js');
const parser = require('body-parser');
const {connectionMysql} = require('../config/connection.config');
const { userInsert, userQuery, userQueryUpdate } =require('../DAO/user.dao')
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());


app.post('/user', (req, res) => {
  const { body: { name, email, password, role } } = req;
  if (!name || !email || !password || !role) return res.status(400).json('{message: "fields are required"}');
  connectionMysql.query(
      userQuery, 
      [email], 
      (err, validation, fields) =>{
      // 500 Internal Server Error
      // A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.[63]
      if (err) return res.status(500).json(err);
      console.log(validation);
      // 409 Conflict
      // Indicates that the request could not be processed because of conflict in the current state of the resource, such as an edit conflict between multiple simultaneous updates.
      if(validation.length >= 1) return res.status(409).json('{message: "email already exists"}');
      connectionMysql.query(
        userInsert, 
        [name, email, hashJS.sha256().update(password).digest('hex'), role],
        (err, results, fields) =>{
          if (err) return res.status(500).json(err);
          res.status(201).json({
            status: 201,
            payload: results
          });
      });
  });
});

app.put('/user/:id', [verifytoken], (req, res) => {
  let { body: {name, password, role}, params: { id } } = req;
  connectionMysql.query(
    userQueryUpdate, [name, password, role, id], (err, {affectedRows}, fields)=> {
    if (err) return res.status(500).json('{}');
    /*
      204 No Content
      The server successfully processed the request, and is not returning any content.
    */
    if (!affectedRows) return res.status(204).json(`{ message: "there´s no information to update", id: ${id} }`);
    res.json({
      status: 200,
      payload: {
        name,
        role
      }
    })
  });
});

module.exports = app
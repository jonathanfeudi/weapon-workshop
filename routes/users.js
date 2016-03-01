var express = require('express');
var users = express.Router();
var bodyParser = require('body-parser');
var db = require('../db/pg');
var session = require('express-session');
var pgSession = require('connect-pg-simple');

users.get('/new', function(req, res){
  res.render('./pages/new.html.ejs');
});

users.post('/', db.createUser, function(req, res){
  res.redirect('/');
});

users.get('/admin', function(req,res){
  if(req.session.user){
    if(req.session.user.admin){
      res.render('./pages/admin', {session: req.session})
    } else {
      res.render('pages/notadmin', {session: req.session})
    }
  } else {
    res.render('pages/notloggedin', {session: req.session})
  }
});

users.get('/login', function(req, res){
  res.render('pages/login.html.ejs', {session: req.session});
});

users.post('/login', db.loginUser, function(req, res){
  req.session.user = res.rows;
  req.session.save(function(){
    res.redirect('/')
  });
});

users.delete('/logout', function(req, res){
  req.session.destroy(function(err){
    res.redirect('/');
  })
});

module.exports = users;

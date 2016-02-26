'use strict'
var express = require('express');
var weapons = express.Router();
var db = require('../db/pg');
var session = require('express-session');
var pgSession = require('connect-pg-simple');

weapons.route('/')
  .get(function(req,res){
    res.send('GET /weapons route')
  })
  .post(db.createWeapon, function(req,res){
    res.send('POST /weapons route')
  })

weapons.get('/new', function(req,res){
  res.render('pages/weapon_edit', {session: req.session})
});

weapons.get('/arsenal',function(req, res, next){
  if(req.session.user){
    next()
  }
  else {
    res.render('pages/notloggedin', {session: req.session})
  }
}, db.getArsenal, function(req, res){
  res.render('pages/arsenal', {session: req.session, results: res.rows})
});

weapons.route('/:weaponid')
  .get(db.displayWeaponStats, function(req,res){
    var ID = req.params.weaponid;
    console.log(res.rows)
    res.send(res.rows)
  })
  .delete(function(req,res){
    res.send('DELETE /:weaponid')
  })

weapons.get('/:weaponid/edit', function(req,res){
  res.send('GET /:weaponid/edit')
});

module.exports = weapons;

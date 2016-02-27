'use strict'
var express = require('express');
var weapons = express.Router();
var db = require('../db/pg');
var session = require('express-session');
var pgSession = require('connect-pg-simple');

weapons.route('/')
  .get(function(req,res){
    res.redirect('/home')
  })
  .post(db.createWeapon, function(req,res){
    res.redirect('/weapons/arsenal')
  })

weapons.get('/new', function(req,res){
  res.render('pages/weapon_edit', {session: req.session})
});

weapons.get('/arsenal',function(req, res, next){
  if(req.session.user){
    console.log(req.session.user)
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
    console.log(res.rows)
    res.send(res.rows)
  })
  .delete(db.deleteWeapon, function(req,res){
    res.redirect('/weapons/arsenal')
  })

weapons.get('/:weaponid/edit', db.grabAllParts, db.grabWeapon, function(req,res){
  res.render('pages/weapon_edit_existing', {session: req.session, engines: res.engines, receivers: res.receivers, barrels: res.barrels, stocks: res.stocks, weapon: res.weapon})
});

module.exports = weapons;

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

weapons.get('/new', db.grabAllParts, function(req,res){
  res.render('pages/weapon_edit', {session: req.session, engines: res.engines, receivers: res.receivers, barrels: res.barrels, stocks: res.stocks})
});

weapons.get('/newpart', function(req, res){
  if(req.session.user){
    if(req.session.user.admin){
      res.render('pages/newpart', {session: req.session})
    } else {
      res.render('pages/notloggedin', {session: req.session})
    }
  } else {
    res.render('pages/notloggedin', {session: req.session})
  }
});

weapons.post('/newengine', db.createEngine, function(req, res){
  res.redirect('/users/admin')
});

weapons.post('/newreceiver', db.createReceiver, function(req, res){
  res.redirect('/users/admin')
});

weapons.post('/newbarrel', db.createBarrel, function(req, res){
  res.redirect('/users/admin')
});

weapons.post('/newstock', db.createStock, function(req, res){
  res.redirect('/users/admin')
});

weapons.get('/arsenal', function(req, res, next){
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

weapons.post('/edit', db.updateWeapon, function(req,res){
  res.redirect('/weapons/arsenal')
});

module.exports = weapons;

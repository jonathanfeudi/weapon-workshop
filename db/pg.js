var pg = require('pg');
var connectionString = "postgres://Feudimonster:"+process.env.DB_PASSWORD+"@localhost/weapon_workshop";
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var session = require('express-session');

function loginUser(req,res,next) {
  var email = req.body.email;
  var password = req.body.password;
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var query = client.query("SELECT * FROM users WHERE email LIKE ($1);", [email], function(err, result){
      done()
      if(err){
        return console.error('error running query', err)
      }
      if (result.rows.length === 0){
        res.status(204).json({success: true, data: 'no content'})
      } else if (bcrypt.compareSync(password, result.rows[0].password_digest)){
        res.rows = result.rows[0]
        next()
      }
    })
  })
}

function createSecure(email, password, callback) {
  //hashing the password given by user
  bcrypt.genSalt(function(err, salt){
    bcrypt.hash(password, salt, function(err, hash){
      //callback saves the email and hashed password to DB
      callback(email, hash)
    })
  })
};


function createUser(req, res, next) {
  createSecure(req.body.email, req.body.password, saveUser);
  function saveUser(email, hash){
    pg.connect(connectionString, function(err, client, done){
      if(err){
        done()
        console.log(err)
        return res.status(500).json({success: false, data: err})
      }
      var query = client.query("INSERT INTO users (email, password_digest) VALUES ($1, $2);", [email, hash], function(err, result){
        done()
        if(err){
          return console.error('error running query', err)
        }
        next()
      })
    })
  }
};

function createWeapon(req, res, next){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var query = client.query("INSERT INTO weapons (name, userid, engineid, receiverid, barrelid, stockid) VALUES ($1, $2, $3, $4, $5, $6);", [req.body.name, req.session.user.userid, req.body.engine, req.body.receiver, req.body.barrel, req.body.stock], function(err, result){
      done()
      if(err){
        return console.error('error running query', err)
      }
      next()
    })
  })
};

function displayWeaponStats(req, res, next){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var weaponID = req.params.weaponid;
    var query = client.query("SELECT w.name, e.dmgtype, e.debuff, r.dmg, r.rof, b.range, b.heat, s.accuracy, s.drawtime FROM weapons w INNER JOIN engines e ON w.engineid = e.engineid INNER JOIN receivers r ON w.receiverid = r.receiverid INNER JOIN barrels b ON w.barrelid = b.barrelid INNER JOIN stocks s ON w.stockid = s.stockid WHERE w.weaponid = "+"'"+weaponID+"';", function(err, result){
      done()
      if(err){
        return console.error('error running query', err)
      }
      if (result.rows.length === 0){
        res.status(204).json({success:true, data: 'no content'})
      } else {
        res.rows = result.rows[0]
        next()
      }
    })
  })
};

function getArsenal(req, res, next){
  pg.connect(connectionString,function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var userID = req.session.user.userid;
    var query = client.query("SELECT weaponid, name FROM weapons WHERE userid = '"+userID+"';", function(err, result){
      done()
      if(err){
        return console.error('error running query', err)
      }
      if (result.rows.length === 0){
        res.status(204).json({success:true, data: 'no content'})
      } else {
        res.rows = result.rows
        next()
      }
    })
  })
};

module.exports.getArsenal = getArsenal;
module.exports.displayWeaponStats = displayWeaponStats;
module.exports.createWeapon = createWeapon;
module.exports.loginUser = loginUser;
module.exports.createUser = createUser;
module.exports.createSecure = createSecure;

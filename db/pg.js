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

function createSecure(email, password, admin, callback) {
  //hashing the password given by user
  bcrypt.genSalt(function(err, salt){
    bcrypt.hash(password, salt, function(err, hash){
      //callback saves the email and hashed password to DB
      callback(email, hash, admin)
    })
  })
};


function createUser(req, res, next) {
  createSecure(req.body.email, req.body.password, req.body.admin, saveUser);
  function saveUser(email, hash, admin){
    pg.connect(connectionString, function(err, client, done){
      if(err){
        done()
        console.log(err)
        return res.status(500).json({success: false, data: err})
      }
      var query = client.query("INSERT INTO users (email, password_digest, admin) VALUES ($1, $2, $3);", [email, hash, admin], function(err, result){
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

function updateWeapon(req, res, next){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var weaponID = req.body.weaponid;
    var query = client.query("UPDATE weapons SET (name, engineid, receiverid, barrelid, stockid) = ($1, $2, $3, $4, $5) WHERE weaponid = '"+weaponID+"';", [req.body.name, req.body.engine, req.body.receiver, req.body.barrel, req.body.stock], function(err, result){
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

function grabWeapon(req, res, next){
  pg.connect(connectionString,function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var weaponID = req.params.weaponid;
    var query = client.query("SELECT * FROM weapons WHERE weaponid = '"+weaponID+"';", function(err, result){
      done()
      if(err){
        return console.error('error running query', err)
      }
      if (result.rows.length === 0){
        res.status(204).json({success:true, data: 'no content'})
      } else {
        res.weapon = result.rows
        next()
      }
    })
  })
};

function grabAllParts(req, res, next){
  grabEngines(req, res, next);
  grabReceivers(req, res, next);
  grabBarrels(req, res, next);
  grabStocks(req, res, next);
  next()
}

function grabEngines(req, res, next){
  pg.connect(connectionString,function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var query = client.query("SELECT engineid, name FROM engines;", function(err, result){
      done()
      if(err){
        return console.error('error running query', err)
      }
      if (result.rows.length === 0){
        res.status(204).json({success:true, data: 'no content'})
      } else {
        res.engines = result.rows
        // next()
      }
    })
  })
};

function grabReceivers(req, res, next){
  pg.connect(connectionString,function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var query = client.query("SELECT receiverid, name FROM receivers;", function(err, result){
      done()
      if(err){
        return console.error('error running query', err)
      }
      if (result.rows.length === 0){
        res.status(204).json({success:true, data: 'no content'})
      } else {
        res.receivers = result.rows
        // next()
      }
    })
  })
};

function grabBarrels(req, res, next){
  pg.connect(connectionString,function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var query = client.query("SELECT barrelid, name FROM barrels;", function(err, result){
      done()
      if(err){
        return console.error('error running query', err)
      }
      if (result.rows.length === 0){
        res.status(204).json({success:true, data: 'no content'})
      } else {
        res.barrels = result.rows
        // next()
      }
    })
  })
};

function grabStocks(req, res, next){
  pg.connect(connectionString,function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var query = client.query("SELECT stockid, name FROM stocks;", function(err, result){
      done()
      if(err){
        return console.error('error running query', err)
      }
      if (result.rows.length === 0){
        res.status(204).json({success:true, data: 'no content'})
      } else {
        res.stocks = result.rows
        // next()
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

function deleteWeapon(req, res, next){
  pg.connect(connectionString,function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var weaponID = req.params.weaponid;
    var query = client.query("DELETE FROM weapons WHERE weaponid = '"+weaponID+"';", function(err, result){
      done()
      if(err){
        return console.error('error running query', err)
      }
      if (result.rows.length === 0){
        res.status(204).json({success:true, data: 'no content'})
      } else {
        next()
      }
    })
  })
};

module.exports.updateWeapon = updateWeapon;
module.exports.deleteWeapon = deleteWeapon;
module.exports.grabReceivers = grabReceivers;
module.exports.grabStocks = grabStocks;
module.exports.grabBarrels = grabBarrels;
module.exports.grabEngines = grabEngines;
module.exports.grabAllParts = grabAllParts;
module.exports.grabWeapon = grabWeapon;
module.exports.getArsenal = getArsenal;
module.exports.displayWeaponStats = displayWeaponStats;
module.exports.createWeapon = createWeapon;
module.exports.loginUser = loginUser;
module.exports.createUser = createUser;
module.exports.createSecure = createSecure;

var pg = require('pg');
if (process.env.ENVIRONMENT === 'production'){
  var connectionString = process.env.DATABASE_URL;
} else {
  var connectionString = "postgres://Feudimonster:"+process.env.DB_PASSWORD+"@localhost/weapon_workshop";
};
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
    var query = client.query("SELECT w.name, e.name as engine, e.dmgtype, e.debuff, r.name as receiver, r.dmg, r.rof, b.name as barrel, b.range, b.heat, s.name as stock, s.accuracy, s.drawtime FROM weapons w INNER JOIN engines e ON w.engineid = e.engineid INNER JOIN receivers r ON w.receiverid = r.receiverid INNER JOIN barrels b ON w.barrelid = b.barrelid INNER JOIN stocks s ON w.stockid = s.stockid WHERE w.weaponid = "+"'"+weaponID+"';", function(err, result){
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
  var client = new pg.Client(connectionString)
  client.connect(function(err){
    if(err){
      return console.error('could not connect to postgres', err);
    }
  });
  var engines = client.query("SELECT * FROM engines;");
  var receivers = client.query("SELECT * FROM receivers;")
  var barrels = client.query("SELECT * FROM barrels;")
  var stocks = client.query("SELECT * FROM stocks;")
  var engineArray = [];
  var receiverArray = [];
  var barrelArray = [];
  var stockArray = [];
  client.on('end', function() {
    next();
  })
  client.on('drain', client.end.bind(client));
  engines.on('row', function(row){
    engineArray.push(row);
    res.engines = engineArray;
  })
  receivers.on('row', function(row){
    receiverArray.push(row);
    res.receivers = receiverArray;
  })
  barrels.on('row', function(row){
    barrelArray.push(row);
    res.barrels = barrelArray;
  })
  stocks.on('row', function(row){
    stockArray.push(row);
    res.stocks = stockArray;
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

function createEngine(req, res, next){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var query = client.query("INSERT INTO engines (name, dmgtype, debuff) VALUES ($1, $2, $3);", [req.body.name, req.body.dmgtype, req.body.debuff], function(err, result){
      done()
      if(err){
        return console.error('error running query', err)
      }
      next()
    })
  })
};

function deleteEngine(req, res, next){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var engineID = req.params.engineid;
    var query = client.query("DELETE FROM engines WHERE engineid = '" + engineID+"';", function(err, result){
      done()
      if(err){
        return console.error('error running query', err)
      }
      next()
    })
  })
};

function createReceiver(req, res, next){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var query = client.query("INSERT INTO receivers (name, dmg, rof) VALUES ($1, $2, $3);", [req.body.name, req.body.dmg, req.body.rof], function(err, result){
      done()
      if(err){
        return console.error('error running query', err)
      }
      next()
    })
  })
};

function deleteReceiver(req, res, next){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var receiverID = req.params.receiverid;
    var query = client.query("DELETE FROM receivers WHERE receiverid = '" + receiverID+"';", function(err, result){
      done()
      if(err){
        return console.error('error running query', err)
      }
      next()
    })
  })
};

function createBarrel(req, res, next){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var query = client.query("INSERT INTO barrels (name, range, heat) VALUES ($1, $2, $3);", [req.body.name, req.body.range, req.body.heat], function(err, result){
      done()
      if(err){
        return console.error('error running query', err)
      }
      next()
    })
  })
};

function deleteBarrel(req, res, next){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var barrelID = req.params.barrelid;
    var query = client.query("DELETE FROM barrels WHERE barrelid = '" + barrelID+"';", function(err, result){
      done()
      if(err){
        return console.error('error running query', err)
      }
      next()
    })
  })
};

function createStock(req, res, next){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var query = client.query("INSERT INTO stocks (name, accuracy, drawtime) VALUES ($1, $2, $3);", [req.body.name, req.body.accuracy, req.body.drawtime], function(err, result){
      done()
      if(err){
        return console.error('error running query', err)
      }
      next()
    })
  })
};

function deleteStock(req, res, next){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var stockID = req.params.stockid;
    var query = client.query("DELETE FROM stocks WHERE stockid = '" + stockID+"';", function(err, result){
      done()
      if(err){
        return console.error('error running query', err)
      }
      next()
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
      next()
    })
  })
};

module.exports.deleteEngine = deleteEngine;
module.exports.deleteReceiver = deleteReceiver;
module.exports.deleteBarrel = deleteBarrel;
module.exports.deleteStock = deleteStock;
module.exports.createEngine = createEngine;
module.exports.createReceiver = createReceiver;
module.exports.createBarrel = createBarrel;
module.exports.createStock = createStock;
module.exports.updateWeapon = updateWeapon;
module.exports.deleteWeapon = deleteWeapon;
module.exports.grabAllParts = grabAllParts;
module.exports.grabWeapon = grabWeapon;
module.exports.getArsenal = getArsenal;
module.exports.displayWeaponStats = displayWeaponStats;
module.exports.createWeapon = createWeapon;
module.exports.loginUser = loginUser;
module.exports.createUser = createUser;
module.exports.createSecure = createSecure;

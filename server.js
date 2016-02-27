pry = require('pryjs');
'use strict'
var connectionString = "postgres://Feudimonster:"+process.env.DB_PASSWORD+"@localhost/weapon_workshop";
var pg = require('pg');
var path       = require('path');
var express    = require('express');
var favicon    = require('serve-favicon');
var logger     = require('morgan');
var path       = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var weaponRoutes = require( path.join(__dirname, '/routes/weapons'));
var userRoutes = require(path.join(__dirname, 'routes/users'));
var dotenv = require('dotenv');
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var db = require('./db/pg');

/* app settings */
var app = express();
var port = process.env.PORT || 3000;

//load .env files
dotenv.load();

//initializing session and pgSession for user registration and login functionality
app.use(session({
  store: new pgSession({
    pg: pg,
    conString: connectionString,
    tableName: 'session'
  }),
  secret: 'shhhhh',
  resave: false,
  cookie: {maxAge: 30 * 24 * 60 * 60 *100}
}));


// static route to public
app.use(express.static(path.join(__dirname, 'public')));


// log (morgan)
app.use( logger('dev') );

//initialize method-override
//method-override will look for '_method' in the action="/route_method=DELETE" route from a form using method="post", then change the method to DELETE in this case
app.use(methodOverride('_method'));

/*Views*/
app.set('views', './views');
app.set('view engine', 'ejs');

//body-parser initialization
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

/*ROUTES*/
// home route
app.get('/', function(req,res){
  res.render('pages/home', {session: req.session});
});


// Routes
app.use( '/weapons', weaponRoutes)
app.use('/users', userRoutes);

app.listen(port,()=>
  console.log('Server online - ready to blast aliens.', port,'//', new Date())
)

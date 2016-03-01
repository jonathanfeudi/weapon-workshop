#Blaster-Bench

Blaster-Bench is a CRUD application where users can create accounts, create, save, and edit schematics for sci-fi weapons. Users select from a number of modules occupying 4 different weapon slots. Admins are additionally able to create new weapon parts, as well as delete existing ones from the database.

##Express

Blaster-Bench uses the Express node module to move between pages in the application. The first of the two, weapons.js, directs to pages related to creating new schematics, viewing one's arsenal, creating or destroying parts, and editing existing weapons. It also calls all related database functionality. There are admin checks for creating and destroying parts, both functions are also linked to from an admin-only page. Users.js contains the routes leading to the login/registration page, the logout functionality, and the admin portal.

##Database Functionality - pg.js

Blaster-Bench calls all of it's database functionality from /db/pg.js. In here are the functions for creating, logging in and out for users (using bcrypt), as well as querying for all weapon parts, weapon data, creating, editing and destroying schematics. They use the Node Postgres module to connect to the database "weapon_workshop."

##Front-End

The front end uses bootstrap.css for general layout purposes, and also uses a CSS glitch effect by Lucas Bebber (http://codepen.io/lbebber/pen/ypgql) on the text in the body of all pages. There is one clientside Javascript file, /scripts/script.js, which does some small DOM manipulation to render the descriptions of parts on the weapon creation and edit screens. The pages are passed the information on all parts, which is stored in a <script> tag in the head, and written to a <div> next to the appropriate row when an option has been selected.

##EJS

Any pages referencing weapons or weapon parts and dynamically rendered using EJS. All of these EJS documents are passed the results of database queries(which are defined in pg.js, and called from the route files), which then populate the pages. The weapon creation and edit forms are both dynamically populated, and will render new parts added to the database by admins.

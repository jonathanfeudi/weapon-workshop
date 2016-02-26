DROP TABLE if exists users;
DROP TABLE if exists sessions;

DROP TABLE if exists weapons CASCADE;
DROP TABLE if exists arsenal CASCADE;

DROP TABLE if exists barrels CASCADE;
DROP TABLE if exists receivers CASCADE;
DROP TABLE if exists stock CASCADE;
DROP TABLE if exists engines CASCADE;

CREATE TABLE weapons (
  weaponid serial PRIMARY KEY UNIQUE,
  userid integer REFERENCES users,
  name VARCHAR(255),
  engineid integer REFERENCES engines,
  receiverid integer REFERENCES receivers,
  barrelid integer REFERENCES barrels,
  stockid integer REFERENCES stocks
);

CREATE TABLE barrels (
  barrelid serial PRIMARY KEY UNIQUE,
  name text NOT NULL,
  range integer NOT NULL,
  heat integer NOT NULL
);

CREATE TABLE receivers (
  receiverid serial PRIMARY KEY UNIQUE,
  name text NOT NULL,
  dmg integer NOT NULL,
  rof integer NOT NULL
);

CREATE TABLE stocks (
  stockid serial PRIMARY KEY UNIQUE,
  name text NOT NULL,
  accuracy integer NOT NULL,
  drawtime integer NOT NULL
);

CREATE TABLE engines (
  engineid serial PRIMARY KEY UNIQUE,
  name text NOT NULL,
  dmgtype text NOT NULL,
  debuff text
);

CREATE TABLE arsenal (
  userid integer REFERENCES users,
  weaponid integer REFERENCES weapons
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE TABLE users (
       userid SERIAL UNIQUE PRIMARY KEY,
       email VARCHAR(255),
       password_digest TEXT
);

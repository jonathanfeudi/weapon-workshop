INSERT INTO barrels (name, range, heat) VALUES ('Sniper', 10, 5);
INSERT INTO barrels (name, range, heat) VALUES ('Rifle', 8, 4);
INSERT INTO barrels (name, range, heat) VALUES ('SMG', 6, 3);
INSERT INTO barrels (name, range, heat) VALUES ('Pistol', 4, 1);

INSERT INTO receivers (name, dmg, rof) VALUES ('Zwei', 10, 2);
INSERT INTO receivers (name, dmg, rof) VALUES ('Claymore', 8, 3);
INSERT INTO receivers (name, dmg, rof) VALUES ('Sabre', 5, 5);
INSERT INTO receivers (name, dmg, rof) VALUES ('Stiletto', 3, 10);

INSERT INTO stocks (name, accuracy, drawtime) VALUES ('Marksman', 10, 5);
INSERT INTO stocks (name, accuracy, drawtime) VALUES ('Full', 8, 3);
INSERT INTO stocks (name, accuracy, drawtime) VALUES ('Short', 6, 1);
INSERT INTO stocks (name, accuracy, drawtime) VALUES ('None', 4, 0);

INSERT INTO engines (name, dmgtype, debuff) VALUES ('Mechanical','Physical','None');
INSERT INTO engines (name, dmgtype, debuff) VALUES ('Combustion','Thermal','DoT');
INSERT INTO engines (name, dmgtype, debuff) VALUES ('Plasma','Energy','Lowers Defense');
INSERT INTO engines (name, dmgtype, debuff) VALUES ('Cold Fusion','Freeze','Slow');

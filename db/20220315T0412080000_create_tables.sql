drop table if exists channels;
create table if not exists channels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  channelname VARCHAR(255) NOT NULL
);

INSERT INTO channels (channelname) VALUES ("5134 gang");
INSERT INTO channels (channelname) VALUES ("BTC");
INSERT INTO channels (channelname) VALUES ("fats domino");



drop table if exists messages;
create table if not exists messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  channel_id INT NOT NULL,
  user varchar(255) NOT NULL,
  content text
);

INSERT INTO messages (channel_id, user, content) VALUES (0, "yash", "hey whats up woofus this is chat 1");
INSERT INTO messages (channel_id, user, content) VALUES (0, "rufus", " bark bark bark bark");
INSERT INTO messages (channel_id, user, content) VALUES (1, "yash", "hi nala this is chat 2");
INSERT INTO messages (channel_id, user, content) VALUES (1, "nala", "soft bark bark bark bark");

drop table if exists auth;
create table if not exists auth (
  authkey varchar(255) NOT NULL,
  channel_id INT NOT NULL,
  PRIMARY KEY (authkey, channel_id)
);

INSERT INTO auth (authkey, channel_id) VALUES ('testauthkey', 0);
INSERT INTO auth (authkey, channel_id) VALUES ('testauthkey', 1);



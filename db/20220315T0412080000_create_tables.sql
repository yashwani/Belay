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


drop table if exists users;
create table if not exists users(
  username varchar(255) NOT NULL,
  pwd varchar(255) NOT NULL,
  authkey varchar(255) NOT NULL,
  PRIMARY KEY(username)
);

INSERT INTO users (username, pwd, authkey) VALUES ('yash', 'password', 'testauthkey');
INSERT INTO users (username, pwd, authkey) VALUES ('rufus', 'password', 'rufusauthkey');


drop table if exists replies;
create table if not exists replies(
  id INT AUTO_INCREMENT PRIMARY KEY,
  message_id int NOT NULL,
  channel_id int NOT NULL,
  user varchar(255) NOT NULL,
  content text
);

INSERT INTO replies(message_id, channel_id, user, content) VALUES(1, 0, 'nala', 'this is a reply to yashs first message');
INSERT INTO replies(message_id, channel_id, user, content) VALUES(2, 0, 'nala', 'this is a reply to another message');
INSERT INTO replies(message_id, channel_id, user, content) VALUES(1, 0, 'nala', 'this is another reply to yashs first message');

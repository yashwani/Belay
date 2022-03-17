import string
import random
from datetime import datetime

from flask import Flask, render_template, request, jsonify
from functools import wraps
import uuid
import sqlite3

import json

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


@app.route('/api/chats', methods=['GET'])
def channels():
    connection = sqlite3.connect("db/belay.db")
    cursor = connection.cursor()
    rows = cursor.execute("SELECT rowid, channelname FROM channels").fetchall()

    channels = {}
    for row in rows:
        channels[row[0]] = row[1]

    return channels, 200


@app.route('/api/messages', methods=['GET'])
def messages():
    authkey = request.headers.get('Authorization')
    channel = request.headers.get('Channel')

    connection = sqlite3.connect("db/belay.db")
    cursor = connection.cursor()

    permission = cursor.execute(
        "SELECT * FROM users WHERE authkey = ?", (authkey,)).fetchall()

    if len(permission) == 0:
        return jsonify([]), 403

    msg = cursor.execute(
        "select * from messages where channel_id = ? ORDER BY rowid ASC", (channel,)).fetchall()

    messages = []
    for m in msg:
        messages.append([m[2], m[3]])

    # Update last_read table below ==============================
    last_read = cursor.execute(
        "select max(rowid) from messages where channel_id = ?", (channel,)).fetchall()[0][0]

    if last_read == None:
        last_read = 0

    notseenbefore = len(cursor.execute(
        "select * from last_Read where channel_id = ? and authkey = ?", (channel, authkey,)).fetchall()) == 0

    if notseenbefore:
        cursor.execute("insert into last_read(last_read_message_id, channel_id, authkey) VALUES (?,?,?)",
                       (last_read, channel, authkey,))
    else:
        cursor.execute("update last_read set last_read_message_id = ? where channel_id = ? and authkey = ?",
                       (last_read, channel, authkey,))
    connection.commit()
    # Update last_read table above ==============================

    return jsonify(messages), 200


@ app.route('/api/replies', methods=['GET'])
def replies():
    authkey = request.headers.get('Authorization')
    channel = request.headers.get('Channel')

    connection = sqlite3.connect("db/belay.db")
    cursor = connection.cursor()

    permission = cursor.execute(
        "SELECT * from users where authkey = ? ", (authkey,)).fetchall()

    if len(permission) == 0:
        return jsonify([]), 403

    rpl = cursor.execute("SELECT message_id, replies.user,replies.content,messages.content from replies inner join messages on message_id = messages.rowid where replies.channel_id = ? order by message_id asc, replies.rowid asc", (channel,)).fetchall()

    return jsonify(rpl), 200


@ app.route('/api/postMessage', methods=['POST'])
def postMessage():
    body = request.json
    channel = int(body['channel'])
    authkey = body['authkey']
    content = body['content']

    connection = sqlite3.connect("db/belay.db")
    cursor = connection.cursor()
    user = cursor.execute(
        "select username from users where authkey = ?", (authkey,)).fetchall()[0][0]
    cursor.execute(
        "INSERT INTO messages (channel_id, user, content) VALUES (?,?,?)", (channel, user, content,))
    connection.commit()

    return "", 204


@ app.route('/api/postReply', methods=['POST'])
def postReply():
    body = request.json
    message = int(body['message'])
    channel = int(body['channel'])
    content = body['content']
    authkey = request.headers.get('Authorization')

    connection = sqlite3.connect("db/belay.db")
    cursor = connection.cursor()
    user = cursor.execute(
        "select username from users where authkey = ?", (authkey,)).fetchall()[0][0]

    cursor.execute("INSERT INTO replies(message_id, channel_id, user, content) VALUES(?, ?, ?, ?)",
                   (message, channel, user, content,))

    connection.commit()

    return "", 204


@ app.route('/api/attemptLogin', methods=['GET'])
def attemptLogin():
    username = request.headers.get('Username')
    password = request.headers.get('Password')

    connection = sqlite3.connect("db/belay.db")
    cursor = connection.cursor()

    permission = cursor.execute(
        "SELECT authkey FROM users WHERE username=? AND pwd = ?", (username, password)).fetchall()

    if len(permission) == 0:
        return "", 403

    return jsonify(permission[0][0]), 200


@ app.route('/api/createAccount', methods=['POST'])
def createAccount():
    body = request.json
    username = body['username']
    password = body['password']

    auth_key = str(uuid.uuid4())

    connection = sqlite3.connect("db/belay.db")
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO users (username, pwd, authkey) VALUES (?,?,?)", (username, password, auth_key,))
    connection.commit()

    return "", 204


@ app.route('/api/unreadMessages', methods=['GET'])
def unreadMessages():
    authkey = request.headers.get('Authorization')

    connection = sqlite3.connect("db/belay.db")
    cursor = connection.cursor()

    permission = cursor.execute(
        "SELECT * from users where authkey = ? ", (authkey,)).fetchall()

    if len(permission) == 0:
        return jsonify(""), 403

    unreadMessages = cursor.execute("with my_last_read as (with all_channels as (select distinct rowid-1 as channel_id from channels) select all_channels.channel_id, coalesce(last_read.last_read_message_id,0) as last_read_id from all_channels left join last_read on all_channels.channel_id = last_read.channel_id and last_read.authkey = ?) select my_last_read.channel_id,count(*) from my_last_read left join messages on my_last_read.channel_id = messages.channel_id where messages.rowid > my_last_read.last_read_id group by messages.channel_id;", (authkey,)).fetchall()
    print("PRinting unread messages")
    print(authkey)
    print(unreadMessages)
    return jsonify(unreadMessages), 200


app.run(debug=True, port=5002)

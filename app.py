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

    return jsonify(messages), 200


@app.route('/api/replies', methods=['GET'])
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
    print(rpl)

    return jsonify(rpl), 200


@app.route('/api/postMessage', methods=['POST'])
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


@app.route('/api/attemptLogin', methods=['GET'])
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


@app.route('/api/createAccount', methods=['POST'])
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


app.run(debug=True, port=5002)

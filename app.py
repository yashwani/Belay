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
    connection = sqlite3.connect("db/belay.db")
    cursor = connection.cursor()

    authkey = request.headers.get('Authorization')
    channel = request.headers.get('Channel')

    permission = cursor.execute(
        "SELECT channel_id from auth where authkey = ? AND channel_id = ?", (authkey, channel)).fetchall()

    if len(permission) == 0:
        return {}, 403

    msg = cursor.execute(
        "select * from messages where channel_id = ? ORDER BY rowid ASC", (channel)).fetchall()
    print(msg)

    messages = []
    for m in msg:
        messages.append([m[2], m[3]])

    return jsonify(messages), 200


app.run(debug=True, port=5002)

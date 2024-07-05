from flask import Flask, render_template, make_response, request, abort, url_for, redirect
from flask_socketio import SocketIO, send, emit


import secrets
import datetime

import events_db

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex()
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template("calendar.html")


@socketio.on("load_events")
def load_events(date, group=0x0):
    print(date)
    events_db.load_events(date)

@socketio.on("create_event")
def create_event(title: str, info: str, date: str):
    print(date)
    date = datetime.datetime.strptime(date, "%Y-%m-%d").date()
    events_db.create_event(title, info, date)

if __name__ == '__main__':
    socketio.run(app)

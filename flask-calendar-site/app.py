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
    return render_template("home.html")

@app.route("/home")
def home():
    return render_template("home.html")

@app.route("/calendar")
def calendar():
    return render_template("calendar.html")

# this one's not working
@app.route("/", methods=["POST"])
def post_event():
    return render_template("calendar.html")

@app.route("/signup")
def signup_page():
    return render_template("signup.html", signup=1)

@app.route("/login")
def login_page():
    return render_template("signup.html", signup=0)

@app.route("/signup", methods=["POST"])
def signup():
    if events_db.add_user(request.form["username"], request.form["password"]):
        return redirect("calendar")     # change this later to redirect Logged in
    else:
        #user already exists
        return "User already exists."

@app.route("/login", methods=["POST"])
def login():
    if events_db.check_login(request.form["username"], request.form["password"]):
        return redirect("calendar") # change this later too
    else:
        return "Incorrect login details."

@socketio.on("load_events")
def load_events(date, group=0):
    return events_db.load_events(date)

@socketio.on("create_event")
def create_event(title: str, info: str, date: str):
    date = datetime.datetime.strptime(date, "%Y-%m-%d").date()
    events_db.create_event(title, info, date)

if __name__ == '__main__':
    socketio.run(app)

from flask import Flask, render_template, make_response, request, abort, url_for, redirect
from flask_socketio import SocketIO, send, emit


import secrets
import datetime
import uuid

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
    #check for cookie
    if events_db.username_from_token(request.cookies.get("auth_token")):
        return render_template("calendar.html")
    return redirect("home.html")

# this one's not working
# @app.route("/", methods=["POST"])
# def post_event():
#     return render_template("calendar.html")

@app.route("/groups")
def groups():
    return render_template("groups.html")

@app.route("/signup")
def signup_page():
    return render_template("signup.html", signup=1)

@app.route("/login")
def login_page():
    return render_template("signup.html", signup=0)

@app.route("/signup", methods=["POST"])
def signup():
    if events_db.add_user(request.form["username"], request.form["password"]):
        res = make_response(url_for("calendar"))     # change this later to redirect Logged in
        auth_token = str(uuid.uuid4())
        events_db.add_user_token(request.form["username"], auth_token)
        res.set_cookie(key="auth_token", value=auth_token, max_age=999999)
        return res
    else:
        #user already exists
        return "User already exists."

@app.route("/login", methods=["POST"])
def login():
    if events_db.check_login(request.form["username"], request.form["password"]):
        res = make_response(url_for("calendar"))
        auth_token = str(uuid.uuid4())
        events_db.add_user_token(request.form["username"], auth_token)
        res.set_cookie(key="auth_token", value=auth_token, max_age=999999)
        return res
    else:
        return "Incorrect login details."

@app.route("/groups", methods=["POST"])
def create_group(group_name: str):
    auth_token = request.cookies.get("auth_token")
    username = events_db.username_from_token(auth_token)
    if username is None:
        return "Error retrieving current user info."
    events_db.create_group(username, group_name)
    # TODO: redirect to new group page


@socketio.on("load_events")
def load_events(date, group=0):
    return events_db.load_events(date)

@socketio.on("create_event")
def create_event(title: str, info: str, date: str):
    date = datetime.datetime.strptime(date, "%Y-%m-%d").date()
    events_db.create_event(title, info, date)

@socketio.on("load_groups")
def load_groups():
    auth_token = request.cookies.get("auth_token")
    username = events_db.username_from_token(auth_token)
    return events_db.get_groups(username)

@socketio.on("load_group_invites")
def load_group_invites():
    auth_token = request.cookies.get("auth_token")
    username = events_db.username_from_token(auth_token)
    return events_db.get_group_invites(username)

@socketio.on("join_group")
def join_group(group_id: int):
    auth_token = request.cookies.get("auth_token")
    username = events_db.username_from_token(auth_token)
    events_db.join_group(username, group_id)

if __name__ == '__main__':
    socketio.run(app)

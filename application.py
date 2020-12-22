import os
import datetime
import random
from binascii import a2b_base64

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, url_for
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash
import json, boto3

from helpers import apology, login_required

# Configure application
app = Flask(__name__)

# connecting s3
s3 = boto3.client('s3')

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True


# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("postgres://bfoebkdwmfxfvs:173a7c7b1c4f3178aa029e1f255fce358614db72951807d30451b07b4f6c4ecc@ec2-54-84-98-18.compute-1.amazonaws.com:5432/ddrmgshdppad7o")

@app.route("/", methods=["GET", "POST"])
def index():
    # grab data
    return render_template("index.html")

@app.route("/art1", methods=["GET", "POST"])
def art():
    # grab data
    if request.method == "POST":
        # making sure the URL exists
        if (request.values.get("favorite") != None):
            url = request.values.get("favorite")
            number = request.values.get("art_piece")

            username = db.execute("SELECT username FROM users WHERE id = ?", session["user_id"])[0]
            filename = "/static/favorites/" + str(random.randint(0, 10000)) + username["username"] + ".png"

            data = url.split(",")[1]
            binary_data = a2b_base64(data)

            with open(filename, "wb") as f:
                f.write(binary_data)

            # Not very efficient because I am saving image into SQL, takes a long time to load
            db.execute("INSERT INTO favorites (user_id, filename) VALUES (?, ?)", session["user_id"], url)

            flash("Successfully saved into favorites!")
            return redirect("/art1?next=" + str(number))
        else:
            return redirect("/art1?next=1")
    else:
        # Getting number for art piece to display
        number = request.values.get('next')

        # Making sure the number exists
        if number == None:
            number = 1
        number = int(number)

        # Checking number to make sure it's in the gallery range
        pieces = db.execute("SELECT * FROM gallery")
        num_art = len(pieces)
        if number > len(pieces):
            return render_template("end.html")
        if number <= 0:
            return render_template("index.html")

        art = db.execute("SELECT filename, description, code, name FROM gallery WHERE id = ?", number)

        # Selecting the code file and opening and reading it

        code = ""
        with open(art[0]["code"], 'r') as f:
            code = f.read().replace("\n", '<br>').replace('  ', "&nbsp;&nbsp;")
        return render_template("art1.html", gallery=art, text=code, number=number)


@app.route("/favorites", methods=["GET", "POST"])
@login_required
def favorites():
    # Show favorites gallery
    if request.method == "POST":
        url = request.values.get("url")
        db.execute("DELETE FROM favorites WHERE filename = ?", url)

        # Flash message
        flash("Deleted from favorites")
        return redirect("/favorites")
    else:
        # taking all the data from SQL favorites table and displaying it
        favs = db.execute("SELECT filename FROM favorites WHERE user_id = ?", session["user_id"])
        return render_template("favorites.html", favorites=favs)


@app.route("/gallery")
def gallery():
    """Show history of transactions"""
    # taking all the data from SQL gallery table and displaying it
    art = db.execute("SELECT id, filename, name FROM gallery ORDER BY id")
    return render_template("gallery.html", gallery=art)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            flash("Must provide username")
            return render_template("login.html", alert="danger")

        # Ensure password was submitted
        elif not request.form.get("password"):
            flash("Must provide password")
            return render_template("login.html", alert="danger")

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            flash("invalid username and/or password")
            return render_template("login.html", alert="danger")

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        flash("You were successfully logged in!")
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    flash("Logged out.")
    return redirect("/")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    error = None
    if request.method == "POST":

        username = request.form.get("username")
        name = request.form.get("name")
        password = request.form.get("password")
        confirm = request.form.get("confirmation")

        # Query database
        rows = db.execute("SELECT username FROM users WHERE username = ?", username)

        # Error checking
        if not username or not password or not confirm:
            flash("Please do not leave any inputs blank")
            return render_template("register.html", alert="danger")
        if len(rows) == 1:
            flash("That username has been chosen already")
            return render_template("register.html", alert="danger")
        if confirm != password:
            flash("Your passwords were not the same")
            return render_template("register.html", alert="danger")

        # Add hashed pass to SQL db
        hashed_pass = generate_password_hash(password)
        db.execute("INSERT INTO users(username, hash, name) VALUES(?, ?, ?)", username, hashed_pass, name)
        flash("Successfully registered!")
        return render_template("login.html")

    else:
        return render_template("register.html")


def errorhandler(e):
    """Handle error"""
    if not isinstance(e, HTTPException):
        e = InternalServerError()
    return apology(e.name, e.code)


# Listen for errors
for code in default_exceptions:
    app.errorhandler(code)(errorhandler)

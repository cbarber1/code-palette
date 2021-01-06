import os
import datetime
import random
from binascii import a2b_base64
from pathlib import Path

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, url_for, jsonify
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash
import json
import logging
import boto3
from botocore.exceptions import ClientError
import stripe


from helpers import apology, login_required

# Configure application
app = Flask(__name__)

S3_BUCKET = os.environ.get('S3_BUCKET')
STRIPE_PUBLIC_KEY = os.environ.get('STRIPE_PUBLIC_KEY')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Stripe setup
stripe.api_key = STRIPE_SECRET_KEY

@app.before_request
def before_request():
    if not request.is_secure and app.env != "development":
        url = request.url.replace("http://", "https://", 1)
        code = 301
        return redirect(url, code=code)

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

# for connecting to Amazon S3 bucket
def create_presigned_url(bucket_name, object_name, expiration=3600):
    """Generate a presigned URL to share an S3 object

    :param bucket_name: string
    :param object_name: string
    :param expiration: Time in seconds for the presigned URL to remain valid
    :return: Presigned URL as string. If error, returns None.
    """

    # Generate a presigned URL for the S3 object
    s3_client = boto3.client('s3')
    try:
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)
    except ClientError as e:
        logging.error(e)
        return None

    # The response contains the presigned URL
    return response

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
  """ Shop """

  price = request.get_json();

  stripe_session = stripe.checkout.Session.create(
      billing_address_collection='auto',
      shipping_address_collection={
        'allowed_countries': ['US', 'CA'],
      },
      payment_method_types=['card'],
      line_items=[{
        'price': price['price'],
        'quantity': 1,
      }],
      mode='payment',
      success_url= url_for('success', _external=True) + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url= url_for('shop', _external=True),
  )

  return jsonify(id=stripe_session.id)

@app.route("/", methods=["GET", "POST"])
def index():
    # grab data
    return render_template("index.html")

@app.route("/about", methods=["GET"])
def about():
    # grab data
    url = create_presigned_url(S3_BUCKET, "aboutme.jpeg")
    return render_template("about.html", url=url)

@app.route("/art1", methods=["GET", "POST"])
def art():
    # grab data
    if request.method == "POST":
        # making sure the URL exists
        if (request.values.get("favorite") != None):
            url = request.values.get("favorite")
            number = request.values.get("art_piece")

            username = db.execute("SELECT username FROM users WHERE id = ?", session["user_id"])[0]
            filename = str(random.randint(0, 10000)) + username["username"] + ".png"

            # putting the saved image into the server temporarily
            data = url.split(",")
            binary_data = a2b_base64(data[1])
            file_path = Path(filename)
            file_path.touch(exist_ok=True)  # will create file, if it exists will do nothing
            fd = open(filename, 'wb')
            fd.write(binary_data)
            fd.close()

            # putting the file into the Amazon S3 bucket
            # using boto3 library, look at their docs on uploading files to get more od an idea
            s3 = boto3.client('s3')
            with open(filename, "rb") as f:
                s3.upload_fileobj(f, S3_BUCKET, filename)

            # Not very efficient because I am saving image into SQL, takes a long time to load
            db.execute("INSERT INTO favorites (user_id, filename) VALUES (?, ?)", session["user_id"], filename)

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
        filename = url.split("com/")
        name = filename[1].split("?")

        # Delete saved image from the favorites table
        db.execute("DELETE FROM favorites WHERE filename = ?", name[0])

        # Deletes the object from the S3 bucket to not waste storage
        client = boto3.client('s3')
        client.delete_object(Bucket=S3_BUCKET, Key=name[0])

        # Flash message
        flash("Deleted from favorites")
        return redirect("/favorites")
    else:
        # taking all the data from SQL favorites table and displaying it
        favs = db.execute("SELECT filename FROM favorites WHERE user_id = ?", session["user_id"])
        urls = []
        for i in range(len(favs)):
            urls.append(create_presigned_url(S3_BUCKET, favs[i]["filename"]))
        return render_template("favorites.html", favorites=urls)


@app.route("/gallery")
def gallery():
    """Show gallery of art"""
    # taking all the data from SQL gallery table and displaying it
    art = db.execute("SELECT id, filename, name FROM gallery ORDER BY id")
    return render_template("gallery.html", gallery=art)

@app.route("/shop")
def shop():
    shop = db.execute("SELECT id, name, cost, description, image_name, image_url FROM shop ORDER BY id")
    urls = []
    for i in shop:
        urls.append(create_presigned_url(S3_BUCKET, i["image_name"]))
        #db.execute("UPDATE shop SET image_url = ? WHERE id = ?", url, i["id"])

    return render_template("shop.html", info=shop, urls=urls)

@app.route("/shopart")
def shopart():
    piece = request.values.get("art")
    art = db.execute("SELECT id, name, cost, description, image_name, image_url, price_data FROM shop WHERE id = ?", piece)[0]
    url = create_presigned_url(S3_BUCKET, art["image_name"])
    words = []
    parts = art["description"].split("&")
    for part in parts:
        words.append(part)

    return render_template("shopart.html", art=art, url=url, words=words, checkout_public_key=STRIPE_PUBLIC_KEY)

@app.route("/success")
def success():
    return render_template("success.html")

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

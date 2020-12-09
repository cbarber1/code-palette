# URL for project video
https://www.youtube.com/watch?v=QpkzoTR5IDc

# URL after deploying on Heroku and connecting to custom domain
# I made it in the CS50 IDE but only recently decided to try and host it on a domain that I had bought
# It may take a while to connect the first time because in the free version of Heroku, the app sleeps when it is not used for a bit
# And it takes some time to activate when you first go to the domain again.
http://www.codepalette.net/

# How to get the project running on your own computer

Make sure that you have downloaded all the libraries necessary, in addition to the project folder itself.
- cs50 python library
- Flask
- Flask-session
- requests

If you are going to test in the CS50 ide, there is no need to download anything besides the project folder
because those libraries are already downloaded on the CS50's server. However, if not, you will need those
libraries downloaded locally on your own computer. If you are running it locally, make sure to also have
Python 3.7.9 downloaded, though it might work with other versions of Python 3. You can check your python
version with the command

python --version

You can also try running it on Heroku by following the steps laid out here after downloading the project folder:
https://devcenter.heroku.com/articles/getting-started-with-python. Instead of the sample app, just use the 
project folder. The files needed are already in the project file, so you shouldn't have to worry about the 
procfile part or anything after the deploy the app tab. In addition, all of the required libraries are in the 
requirements.txt, so you don't need to worry about downloading those to Heroku.

# Running it locally or on CS50 IDE

The only thing you have to do to run it is three commands.

1. cd project

This just enters you into the project folder from the terminal. There are four folders in this folder. Documentation,
proposal, status, and code-palette. The design.md file and README.md file are in the documentation folder. The only
other folder you have to worry about is the code-palette folder.

2. cd code-palette

This command enters you into the actual flask application folder. Now you're ready to actually run the command that
starts the flask application.

3. flask run

And there you go! It should start a flask server, and you can then click on the link that comes up in the
terminal. It should open a new tab in your browser, and you should see the website! You can use the link
on any device, not only the one where you started the flask server. However, the website and experience is
designed for the computer, so it won't work well on a phone. The art pieces cannot resize at the moment,
so they mess up the design on mobile devices, as well as not having input from the keyboard. It might look
fine on a tablet, but I'm unsure of the functionality of the website because I haven't been able to test that.

# Using the website

The website itself is pretty self-explanatory. Once you have the flask server running, you'll be able to use
the website normally, and access the login and register, as well as the gallery and front page. If you register
and log in, you'll have access to a favorites page that will be empty until you press the Save Image to Favorites
button on one of the art pages.

# Have fun and I hope you enjoy my project!

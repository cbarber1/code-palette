# DESIGN document for Code Palette
# By Chris Barber

# Libraries used
- Bootstrap
- p5.js
- Flask
- cs50
- requests
- flask-session
- gunicorn (for hosting on Heroku)

# Heroku

I did this late, so you can also test it on CS50 IDE, but I did host it on Heroku as a flask app. I had to learn how to host
on Heroku and connect it to my domain that I had bought on Google Domains and luckily there were a couple of articles on how to do that.

I added a Procfile and a library called gunicorn to get it to work on Heroku, as well as a runtime.txt file. My Procfile looked like
web: gunicorn application:app --preload. The --preload was necessary for getting the login and registration pages working properly.
And I had to download Heroku CLI on my computer from terminal. I didn't realize there was a cs50 doc for Heroku, so I just followed Heroku's
documentation, and some articles online to figure out how to do it. I also had to add gunicorn to the requirements.txt to get it to
work.

For the Google Domain part, I just followed this article:
https://medium.com/@david.gagne/set-up-a-custom-domain-for-your-heroku-application-using-google-domains-guaranteed-a2b2ff934f97

# How I made the login and registration

I mostly took what we had from CS50 Finance and put it into my code for the login and registration.
I decided to do away with the apology template because I thought it might be annoying if everytime you plugged
in something wrong, you get taken to another page. So I started doing more alerts instead. I learned how to use
the flash() function, which makes it so you can make alerts, and Finance already had a spot for alerts in the
layout.html. So I took that and added a variable with jinja in order to change the color of the alert when I
redirect, just so users can separate the different alerts. My "invalid username/password" was red while the other
alerts were blue. For the registration, I added an extra form that takes the user's name, and some other alerts.
I had to make a new users table in my sqlite database called users which stores id, name, username, and password.

# Navbar

I kept the navbar mostly the same except I made it so even if you aren't logged in, you can visit the gallery and
exhibit (index). When you are logged in, you can see the favorites tab, and I did that using jinja and flask (@login_required).

# Exhibit

The first page of the exhibit, or the index file, has a p5 sketch that uses an algorithm to make a messy sketch of a
photo that you upload to the sketch. I didn't write this algorithm, and you can find it here
https://www.openprocessing.org/sketch/486307. However, I did modify it a bit to get rid of the dots, and I got
rid of the functionality that skips to the next image because I only wanted to display one. I uploaded an image of
some text, and that's how it makes the messy sketch of the text. The algorithm basically works by creating a higher density
of curves where the image pixels are darker, so it sort of outlines the text and makes it appear. I also added a sketchy
border around my explanation of generative art using CSS that I found online (https://codepen.io/andybelldesign/pen/MPLzay).
I thought it went along well with the website.

For the actual exhibit with the art pieces, I decided to go with a dynamic webpage using flask and jinja in order to display
them. I didn't want to have to create multiple html files that were basically the same for each art piece because it wasn't
efficient. Using flask, I can access my sqlite database, much like we did in Finance. I created a table called gallery that
stores information about the pieces like the id, filename, description, code, and name. I don't use the filename part in the
exhibit, but that comes up later with the gallery page. I basically used Jinja to display the name and description under one
tab, and then the code under another. The code is a separate variable because I had to read it from the file with python,
and then write it to a variable. The hardest part was getting the spacing right on the code to make it readable on the page.

I have another column next to the tabs with the description and code, and that is a div called "sketch-holder." In all of my
p5.js code, I set the parent of the canvas to that "sketch-holder" div, so they all showed up there. In order to actually get
the code to run, I added a script block at the top of the html that takes the code file path from the gallery table in the
SQL database. In addition to that, I had to make a toData() function and a keyTyped() function in the same script area. I wrote
these in the html because they apply to all of my art pieces, so I thought it would be much easier if they were in the same spot.
The toData() function converts my p5.js canvas into a data url of a jpg (PNG was too large to store and got cut off)
that I can then store in a SQL table called favorites, that stores the id of the user and data url of the image. I
realize that this is very inefficient to store images inside of SQL database, so I would like to try and fix this at some point.
There isn't much documentation on what I'm trying to do, which is upload from a data URL and not an upload from
the user. Anyway, if you are logged in, you will also see a button that allows you to save your image to canvas. This uses
the toData() function that uses POST to send the data url to the favorites SQL table, along with the gallery number, so I
can stay on the same page after saving the photo to favorites.

I also added a next and previous button at the top of the page, that basically use GET and change the variable
"next" by + or - 1, and that next variable corresponds to the id in the gallery table, so I know which art piece to display.
If that next variable exceeds the amount in the gallery, then it goes straight to the end.html page.

I really tried to make the design look good, and it took a lot of tweaking with the CSS and bootstrap to get the design that
I wanted. Bootstrap documentation and stack overflow were helpful in my endeavor to make the website look good because they
showed me all the different classes I could use in my tags. Often times, if it was only a short CSS line, I would put it into the
tag using style="" because I just thought it was easier to handle and keep track of.

# Gallery

The gallery just takes the information from the gallery table in the SQL database and displays it as a clickable link straight
to the exhibit piece. It took me a while to learn how to get it to look right, espcially because the images kept overlapping
when I resized the window, but I learned about the image responsive tag from bootstrap. The biggest thing I had to figure out
was a function called batch() in jinja that helps you split things up from a list by groups of things. It was very useful because
I had to display a rows of 3 for the gallery. To get the link for the site, I just took the id from gallery because it corresponds
to the site url which is /art1?next= some number(gallery id).

# Favorites

Basically the same as the gallery, but with the favorites table instead. As I mentioned, my toData() function outputted a data URL and
id number (same as user id) to a form input value which then posts it to the /art1 route and puts it in the favorites table, so I could
access them on the favorites page. I just used to the same technique to display the images using batch and jinja. I also added a
download button which just uses the a tag with download="output.png" or something similar. In addition, I added a delete button that
brings up a confirmation modal box, which I learned about through W3 schools. Once you confirm, it just deletes that image from the
favorites table by posting the image info to the favorites route and using SQL commands.

# Art Pieces

# Bloom

Bloom is just a bunch of deformed circles with radius decreasing over time until it hits zero, where the radius increases quite
a bit faster than it decreased. I followed a Youtube tutorial for this, though I modified it a bit, and wrote it in a different
language than the tutorial. https://www.youtube.com/watch?v=i6bL3YzESxo The colors are randomly selected from an array of color
palettes that I got from the tutorial.

# Red Fish Blue Fish

I wrote Red Fish Blue Fish in the summer. The particles move based on the Perlin noise algorithm as I said in the description
and it makes their movement smooth and more lifelike. The particles also have an array of history that shows their path up to
25 spots in order to make that fish tail look. I used the mousePressed() function from p5.js to detect when the mouse is clicked
and to add a new particle to the array when that happens.

# Maze

This maze is one of the most simple pieces that I made, but I still think it looks cool. It's basically just randomly drawing
diagonal lines, either starting from the top corner or the bottom corner in each grid piece. The grid piece size is determined
by the step size, which I decided to subtract by 2 every time the user clicks the canvas. I got the colors from a color palette
site online. I think this type of piece is quite commonly made by generative artists starting out, so it was nice that I was
able to finally make it!

# Cryptic

This one is one of my favorites. It's made using the Maurer Rose equations, and I followed a tutorial online to learn about them
and how to visualize them. https://www.youtube.com/watch?v=4uU9lZ-HSqA&t=436s and also https://en.wikipedia.org/wiki/Maurer_rose.
Basically I just apply that equation and make points along the polar path from one point to the next and it makes some really cool
patterns. I make 361 points (all around the graph) and connect them all with a line. In the code, I loop through the constants in
the equations very slowly because otherwise the patterns would go by way too quickly.

# Wormhole

This was done in the almost the exact same one as Cryptic, although instead of 361 points looping through the Maurer Rose equation
1 by 1, I changed the step to 0.2 and it made the pattern that you see! It basically just creates more paths, and it looks so
awesome. I could watch it forever.

# Rolling Hills

I also made this in the past (I think during high school), following a tutorial online. If you couldn't tell, I really like this
one youtube channel called Coding Train that has tons of tutorials on creative coding. https://www.youtube.com/watch?v=IKB1hWWedMk
However, in the past I had made it using Processing, so I remade it with p5.js. Anyway, it uses 2D Perlin noise to determine the
height of the mesh in 3D space, and uses WEBGL 3D rendering. I am just looping through the 2D Perlin noise and changing the mesh
based on it to make it look like the camera is flying over the terrain. I had to tweak the numbers a bit to make it look like real
terrain, and I think it looks pretty good.

# Honeycomb

This one is a visualization of the Collatz Conjecture. Again, I followed a tutorial to learn about it, but my visualization is
completely different from the tutorial this time. https://www.youtube.com/watch?v=EYLWxwo1Ed8&t=124s
Basically the Collatz Conjecture works by always finding a path to 1. I pick a random number (pretty big) and visualize the
path of that number to 1 for every number up to that number, or in this case every number up to that number with a step of 10.
I kind of went crazy with the visualization and its more abstract, so it's not exactly clear what the Collatz Conjecture means.
The basis is that when you have an even number, you divide by 2, and when you have odd, you do 3(number) + 1. It eventually gets
to one always, but for different numbers it takes a varying amount of times. I am looping through this sequence in reverse, so
every time it takes to get to one I rotate the line by some angle, and the center of the screen represents the number one. I made
the angle a random variable tied to the clicking of the mouse so it made more like an abstract painting which I like.

# Light Speed

I followed a tutorial for this again, https://www.youtube.com/watch?v=17WoOqgXsRM. I have a class called Star, where I store what
the star particle should look like and how it should behave. I then update the particle in the draw function. The particle moves
according to its "z" value which, because it's 2d, is just a representation of how close the particle is to the camera. If its z
value is smaller, then the radius of the particle is smaller to simulate being farther away from the screen. Then, I added lines
to the particles' past positions to give that streaking effect, and matched their speed to the position of the mouse.
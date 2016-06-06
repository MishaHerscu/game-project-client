#Tic Tac Toe Game Project#
##Misha Herscu##

This project is an in-browser Tic Tac Toe game.

The project is hosted at http://mishaherscu.github.io/game-project-client/.

The technologies used were:

* HTML, SCSS, and Bootstrap for the website
* JavaScript and jQuery for running the game engine and manipulating the DOM
* AJAX for interacting with a Ruby on Rails backend to store user and game information

Several user stories I began with include:

1. As a first user, I want to be able to create an account, login, and start a game, so that I can play with friends. 
2. As another user I want to be able to sign in and join a game so that I can play against a friend. 
3. As someone playing a game, I want the board to prevent me from selecting a place where someone already went so that the game adheres to the rules. 
4. As a user, I want to be able to play someone over the web, so that I can play someone remotely.
5. As a user, I want to be able to see some stats about how my games have gone.

Some additional details, as well as wireframes can be found here: https://github.com/MishaHerscu/game-project-scope-study/blob/response/study.md.


The full feature set of the final version of the game, includes:
* user account creation
* user login
* user logout
* user change password
* user can create a game - either single device or two-device
* in a single device game, the user can play someone in tic-tac-toe with normal rules in their browser
* in a multidevice game, they can have someone join their game and play over the web
* users can see their stats (total games, X-wins, O-wins, ties, in-progress
* users can view any old game
* users can pick up where they left off in another game
* if users have another session's auth token, they can take over games associated with that token
* users can exit games, clearing the game model
* i started working on a bot but ran out of time





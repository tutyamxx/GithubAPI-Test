# MableTherapyTest

* Simple one page application built in Vue.JS that interacts with Github API V3
* Application is hosted on Heroku, hence the need for a simple express server to make things easier for me to host and deploy
* The code deployed on Heroku is minified and compiled, so is using the **/dist** directory (Check the source code in here)
* To test it live, go here ➡️ https://mabletest.herokuapp.com/
* Careful, free API without authentication (which is used here) is limited to **60** requests per hour!

# Local Install

* Clone this repo
* **npm i**
* To start it type **npm run serve** for development
* To run tests type **npm run test:unit**

# Search

* You can search by **any username** or you can search by **Github URL's** (all variants work fine). See example of URL's:

- www.github.com/tutyamxx
- https://github.com/tutyamxx/MableTherapyTest/commit/4467571986f86bf862b471055da8a43c93df0868
- https://www.github.com/tutyamxx
- http://www.github.com/tutyamxx
- http://github.com/tutyamxx
- https://github.com/tutyamxx
- github.com/tutyamxx

All the URL's above pasted in the search box, will return my profile details.

:)

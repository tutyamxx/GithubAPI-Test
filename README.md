<p align="center">
  <img src="https://github.com/tutyamxx/GithubAPI-Test/blob/master/totallyignorethis/banner.PNG" widht="300" height="200"><br/>
</p>


# Github API Test - First attempt at a Vue.JS application (can be improved)

* To test it live, go here ➡️ https://githubapitestpac.herokuapp.com/
* Simple one page application built in Vue.JS that interacts with Github API V3
* Application is hosted on Heroku, hence the need for a simple express server to make things easier for me to host and deploy
* Careful, free API without authentication (which is used here) is limited to **60** requests per hour!
* If you get an error while accessing the URL's is most likely that I'm out of free monthly Heroku Dyno hours 🤐

# Local Install

* Clone this repo
* **npm i**
* To start it type **npm run serve** for development
* To run tests type **npm run test:unit**

# Search

* You can search by **any username** or you can search by **Github URL's** (all variants work fine). See example of URL's:

- www.github.com/tutyamxx
- https://github.com/tutyamxx/GithubAPI-Test/commit/6b0c03873b7df0b41d2d9f7c442d2c859b6669cf
- https://www.github.com/tutyamxx
- http://www.github.com/tutyamxx
- http://github.com/tutyamxx
- https://github.com/tutyamxx
- github.com/tutyamxx

All the URL's above pasted in the search box, will return my profile details.

# Activity Examples

![Fork Activity](https://github.com/tutyamxx/GithubAPI-Test/blob/master/totallyignorethis/fork1.PNG)
![PR/Pull Request Activity](https://github.com/tutyamxx/GithubAPI-Test/blob/master/totallyignorethis/pullrequest1.PNG)
![Commit/Push Activity](https://github.com/tutyamxx/GithubAPI-Test/blob/master/totallyignorethis/push1.PNG)
![Watch Activity](https://github.com/tutyamxx/GithubAPI-Test/blob/master/totallyignorethis/watch1.PNG)
![Null/Unknown Activity](https://github.com/tutyamxx/GithubAPI-Test/blob/master/totallyignorethis/unknown1.PNG)




:)

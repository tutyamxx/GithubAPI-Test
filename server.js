// --| Small express server to run our Vue.JS app on Heroku
const express = require("express");
const http = require("http");
const serveStatic = require("serve-static");

const app = express();

// --| Serve the compiled Vue.JS app /dist
app.use(serveStatic(__dirname + "/dist"));

const port = process.env.PORT || 8080;
app.listen(port);

// --| Ping Heroku app and prevent it from sleeping every 15 minutes
setInterval(() =>
{
    http.get("http://githubapitestpac.herokuapp.com/");

}, 900000);

module.exports.app = app;
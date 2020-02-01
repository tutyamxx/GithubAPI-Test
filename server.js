// --| Small express server to run our Vue.JS app on Heroku
const express = require("express");
const serveStatic = require("serve-static");

const app = express();
app.use(serveStatic(__dirname + "/dist"));

const port = process.env.PORT || 8080;
app.listen(port);
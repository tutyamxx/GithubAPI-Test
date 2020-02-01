// --| Small express server to run our Vue.JS app on Heroku
import express from "express";
import serveStatic from "serve-static";
import { get } from "http";

const app = express();

// --| Serve the compiled Vue.JS app /dist
app.use(serveStatic(__dirname + "/dist"));

const port = process.env.PORT || 8080;
app.listen(port);

// --| Ping Heroku app and prevent it from sleeping every 15 minutes
setInterval(() =>
{
    get("http://mabletest.herokuapp.com/");

}, 900000);

export default app;
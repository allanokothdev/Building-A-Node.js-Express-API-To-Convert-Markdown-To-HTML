const express = require('express');
const bodyParser = require('body-parser');
const showdown = require('showdown');
const passport = require('passport');
const jwt = require('jwt-simple');
const LocalStrategy = require('passport-local').Strategy;

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

converter = new showdown.Converter();

const ADMIN = 'admin';
const ADMIN_PASSWORD = 'admin';
const SECRET = 'allanokothdev#9366';

passport.use(new LocalStrategy( function(username, password, done) {
    if (username === ADMIN && password === ADMIN_PASSWORD) {
        done(null, jwt.encode({ username }, SECRET));
        return;
    }
    done(null, false);
}))

app.get('/', function(req, res){
    res.send('Hello World!');
});

app.post('/login', passport.authenticate('local', { session: false}),
    function(req, res) {
    res.send("Authenticated");
});

app.post('/convert', passport.authenticate('local', { session: false, failWithError: true }),
   function(req, res, next) {
    if(typeof req.body.content == 'undefined' || req.body.content == null) {
        res.json(["error", "No Data found"])
    } else {
        text = req.body.content;
        html = converter.makeHtml(text)
        res.json(["markdown", html]);
    }},

    function(err, req, res, next) {
        return res.status(401).send({ success: false, message: err })
    });

app.listen(3000);
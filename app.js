var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
const MongoClient = require('mongodb').MongoClient
require("./passport-init");
var router = express.Router();

var db;
MongoClient.connect('mongodb://localhost/chat', (err, database) => {
    if (err) return console.log(err);
    db = database;
});

//setting "views" as the main folder for our templates
app.set("views", "./views");
//Defining Pug as the main template engine
app.set('view engine', 'pug');

app.use(require("./logging.js"));

app.use(express.static("public"));
app.use(express.static("node_modules/bootstrap/dist"));
app.use(express.static("node_modules/jquery/dist"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(require('express-session')({
    secret: 'keyboard cat', resave: false, saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var authRouter = require("./auth");
app.use(authRouter);

app.use(function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        next();
        return;
    }
    res.redirect("/login");
});

app.get('/', function (req, res) {
    db.collection('chat').find().toArray((err, results) => {
        if (err) return console.log(err);
//rendering the home view on our homepage
        res.render("home", {title: "Home",chat: results});
    });
});

app.post('/books', (req, res) => {
    db.collection('chat').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        res.redirect('/')
    })
});

app.get('/tellus', function (req, res) {
    db.collection('readerinfo').find().toArray((err, results) => {
        if (err) return console.log(err);
        res.render("tellus", {title: "Let us know",chat: results});
    })
});

app.post('/tellus', (req, res) => {
    db.collection('readerinfo').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        res.redirect('/')
    })
});

//Importing the admin module
var adminRouter = require("./admin");
app.use("/admin", adminRouter);

var apiRouter = require("./api");
app.use("/api", apiRouter);

app.listen(3000, function () {
    console.log('Chat app listening on port 3000!');
});

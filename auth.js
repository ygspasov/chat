var express = require("express");
var passport = require("passport");

var router = express.Router();
module.exports = router;

router.get("/login", function (req, res) {
    res.render("login");
});


//Redirecting to the main URL after successful login or reloading the login view on failure
router.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});
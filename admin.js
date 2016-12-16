// Simple, fast generation of RFC4122 UUIDS.
var uuid = require("node-uuid");
//toolkit for manipulating objects and collections
var _ = require("lodash");
var express = require("express");
var rooms = require("./data/rooms.json");

var router = express.Router();
module.exports = router;

//Ensuring only admins can administer chat rooms:
router.use(function (req,res,next) {
    if(req.user.admin){
        res.locals.user=req.user;
        next();
        return;
    }
    res.redirect("/login");
});

//Rendering the rooms view
router.get('/rooms', function (req, res) {
    res.render("rooms", {
        title: "Admin Rooms",
        rooms: rooms
    });
});

router.route('/rooms/add')
    .get(function (req, res) {
        res.render("add");
    })
    //responding to post request
    .post(function (req, res) {
        //creating a room object with name and id
        var room = {
            name: req.body.name,
            id: uuid.v4()
        };

        rooms.push(room);

        //redirecting the user to the list of chat rooms after submission
        res.redirect(req.baseUrl + "/rooms");
    });


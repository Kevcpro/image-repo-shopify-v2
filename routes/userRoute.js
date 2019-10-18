'use strict'

// Imports

require("dotenv").config();
const express = require("express");
const router = express.Router();
const USER = require("../models/userModel");
const IMAGE = require("../models/imageModel");

// Route to create a new user

router.post("/create", function (req, res) {
    var newUser = new USER({
        user_id: 1,
        imageCollection: [],
        balance: 0
    });
    newUser.save(function (error, newUser) {
        if (error) {
            console.log(error);
            throw error;
        }
        else {
            res.status(200).send(newUser);
        }
    });
});

// Route to get a user by their Id
// Requires: The id of the User to be Valid

router.post("/findUser", function (req, res) {
    USER.find({ "user_id": req.body.id }, (err, user) => {
        if (err) {
            return err;
        }
        else {
            res.status(200).send(user);
        }
    });
});

// Route to update a user's image collection
// Requires: The id of the User and an Image id to add to the image collection

router.route("/addImage/:id").put((req, res, next) => {
    USER.findByIdAndUpdate(
        req.params.id,
        { $push: { imageCollection: req.body.imageId } },
        { new: true },
        (err, user) => {
            if (err) {
                console.log(err);
            }
        });
});

// Route to update a user's balance
// Requires: The id of the User and the amount (any integer) 

router.route("/updateBalance/:id").put((req, res, next) => {
    USER.findByIdAndUpdate(
        req.params.id,
        { $inc: { balance: req.body.amount } },
        { new: true },
        (err, user) => {
            if (err) {
                console.log(err);
            }
        }
    )
});



module.exports = router;
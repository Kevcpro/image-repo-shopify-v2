// 'use strict'
require("dotenv").config();
const express = require("express");
const router = express.Router();
const IMAGE = require("../models/imageModel");
const USER = require("../models/userModel");
const multer = require("multer");
var AWS = require("aws-sdk");

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

// Route to return all images
// Requires: N/A
// Implement pagination using cursor

router.route("/").get((req, res, next) => {
    IMAGE.find({}, (err, imageList) => {
        if (err) {
            return next(err);
        }
        res.status(200).send(imageList);
    })
});

// Route to upload a single image
// Requires: Filename of the field that is going to be uploaded.

router.post("/upload", upload.single("file"), function (req, res) {
    const file = req.file;
    const s3FileURL = process.env.AWS_Uploaded_File_URL_LINK;

    let s3bucket = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });


    var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
    };

    s3bucket.upload(params, async function (err, data) {
        if (err) {
            res.status(500).json({ error: true, Message: err });
        } else {
            res.send({ data });
            var newFileUploaded = {
                user_id: req.body.userId[0],
                price: req.body.price[0],
                amountAvailable: req.body.amountAvailable[0],
                permissions: req.body.privacy[0],
                fileLink: s3FileURL + file.originalname,
                s3_key: params.Key,
            };

            var image = await new IMAGE(newFileUploaded);
            await image.save(function (error, newImage) {
                if (error) {
                    throw error;
                }
            });

            var user = await USER.findOneAndUpdate({ "user_id": req.body.userId[0] },
                { "$push": { "imageCollection": image.image_id } });
        }
    });

});

// Route to update the available amount for an image
// Requires: Id of the image to exist

router.route("/updateInventory/:id").put((req, res, next) => {
    IMAGE.findByIdAndUpdate(
        req.params.id,
        { $inc: { amountAvailable: -1 } },
        { new: true },
        (err) => {
            if (err) {
                return next(err);
            }
            res.status(200).send();
        }
    );
});

// Route to delete a image by id
// Requires: id of a valid image in the s3 bucket

router.route("/:id").delete((req, res, next) => {
    IMAGE.findByIdAndRemove(req.params.id, (err, result) => {
        if (err) {
            return next(err);
        }

        let s3bucket = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        });

        let params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: result.s3_key
        };

        s3bucket.deleteObject(params, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                res.send({
                    status: "200",
                    responseType: "string",
                    response: "success"
                });
            }
        });
    });
});

// Route to buy image by Id
// Requires: A valid image Id and the amountAvailable 

router.route("/buy").put(async (req, res, next) => {
    console.log("THIS IS THE " + req.body.image_id);
    const image = await IMAGE.findOne({ "image_id": req.body.image_id });
    if (image.amountAvailable > 0) {
        USER.findOneAndUpdate(
            { "user_id": image.user_id },
            { "$inc": { balance: image.price } },
            { new: true },
            (err, user) => {
                if (err) {
                    console.log(err);
                }
            }
        ).then(() => {
            IMAGE.findOneAndUpdate({ "image_id": req.body.image_id }, { "$inc": { amountAvailable: -1 } },
                { new: true },
                (err, user) => {
                    if (err) {
                        console.log(err);
                    }
                });
            res.status(200).send();
        })
    }
    else {
        res.status(204).send();
    }
});


module.exports = router;
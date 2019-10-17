// 'use strict'
require("dotenv").config();
const express = require("express");
const router = express.Router();
const IMAGE = require("../models/imageModel");
const USER = require("../models/userModel");
const multer = require("multer");
var AWS = require("aws-sdk");

// Multer ships with storage engines DiskStorage and MemoryStorage
//  And Multer adds a body object and a file or files object to the request object. 
//  The body object contains the values of the text fields of the form, the file or 
//  files object contains the files uploaded via the form.

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

// Route to return all images
// Requires: N/A
// Implement pagination using cursor

router.route("/").get((req, res, next) => {
    DOCUMENT.find(
        {},
        null,
        {
            sort: { createdAt: 1 }
        },
        (err, docs) => {
            if (err) {
                return next(err);
            }
            res.status(200).send(docs);
        }
    );
});

// Route to get a single existing GO data (needed for the Edit functionality)

router.route("/:id").get((req, res, next) => {
    DOCUMENT.findById(req.params.id, (err, go) => {
        if (err) {
            return next(err);
        }
        res.json(go);
    });
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

    s3bucket.upload(params, function (err, data) {
        if (err) {
            res.status(500).json({ error: true, Message: err });
        } else {
            res.send({ data });
            var newFileUploaded = {
                description: req.body.description,
                fileLink: s3FileURL + file.originalname,
                s3_key: params.Key,
            };
            var image = new IMAGE(newFileUploaded);
            image.save(function (error, newFile) {
                if (error) {
                    throw error;
                }
            });
        }
    });
});

// Route to edit existing record's description field
// Here, I am updating only the description in this mongo record. Hence using the "$set" parameter
router.route("/edit/:id").put((req, res, next) => {
    DOCUMENT.findByIdAndUpdate(
        req.params.id,
        { $set: { description: Object.keys(req.body)[0] } },
        { new: true },
        (err, updateDoc) => {
            if (err) {
                return next(err);
            }
            res.status(200).send(updateDoc);
        }
    );
});

// Route to delete a image by id
// Requires: id of a valid image in the s3 bucket

router.route("/:id").delete((req, res, next) => {
    DOCUMENT.findByIdAndRemove(req.params.id, (err, result) => {
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

module.exports = router;
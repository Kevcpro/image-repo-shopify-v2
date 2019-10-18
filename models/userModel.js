const mongoose = require("mongoose");
const Schema = mongoose.Schema;


let userSchema = new Schema(
    {
        user_id: { type: Number },
        imageCollection: [Number],
        balance: { type: Number, default: 0 }
    }
);


module.exports = mongoose.model("User", userSchema);
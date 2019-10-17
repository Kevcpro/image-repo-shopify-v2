const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// library for handling autoincrement in mongoose
const AutoIncrement = require("mongoose-sequence")(mongoose);

let userSchema = new Schema(
    {
        document_id: { type: Number, default: 0 },
        images: [Number],
        balance: { type: Number, default: 0 }
    },
    {
        // createdAt,updatedAt fields are automatically added into records
        timestamps: true
    }
);

imageSchema.plugin(AutoIncrement, { inc_field: "document_id" });

module.exports = mongoose.model("User", userSchema);
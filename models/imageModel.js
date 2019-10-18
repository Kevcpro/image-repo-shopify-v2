const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// library for handling autoincrement in mongoose
const AutoIncrement = require("mongoose-sequence")(mongoose);

let imageSchema = new Schema(
  {
    image_id: { type: Number, default: 0 },
    user_id: { type: Number },
    fileLink: { type: String },
    price: { type: Number },
    discount: { type: Number, default: 0 },
    amountAvailable: { type: Number, default: 0 },
    permissions: { type: String },
    s3_key: { type: String }
  }
);

imageSchema.plugin(AutoIncrement, { inc_field: "image_id" });

module.exports = mongoose.model("Image", imageSchema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// library for handling autoincrement in mongoose
const AutoIncrement = require("mongoose-sequence")(mongoose);

let imageSchema = new Schema(
  {
    document_id: { type: Number, default: 0 },
    owner_id: { type: Number },
    description: { type: String },
    fileLink: { type: String },
    price: { type: Number },
    discount: { type: Number, default: 0 },
    amountAvailable: { type: Number, default: 0 },
    permissions: { type: String },
    s3_key: { type: String }
  },
  {
    // createdAt,updatedAt fields are automatically added into records
    timestamps: true
  }
);

imageSchema.plugin(AutoIncrement, { inc_field: "document_id" });

module.exports = mongoose.model("Image", imageSchema);
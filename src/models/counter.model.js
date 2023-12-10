const { Schema, model } = require("mongoose");

const counterSchema = new Schema({
  tenantId: {
    type: String,
  },
  seq: {
    type: Number,
  },
});

module.exports = model("counter", counterSchema, "countersEgreso");

const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
  name: {
    type: String,
  },
});

roleSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

roleSchema.set("toJSON", {
  virtuals: true,
});

exports.Role = mongoose.model("Role", roleSchema);

const mongoose = require("mongoose");
const { Role } = require("./role");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

userSchema.pre("save", async function (next) {
  try {
    const getRole = await Role.findById("6149eace529f4312e7b42e0e");
    this.role = getRole._id;
  } catch (error) {
    console.log(error);
  }

  next();
});

exports.User = mongoose.model("User", userSchema);

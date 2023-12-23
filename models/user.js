const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
    min: 5,
    max: 10,
  },
  password: {
    type: String,
    require: true,
    min: 6,
    max: 1024,
  },
});

module.exports = mongoose.model("User", usersSchema);

const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async function () {
  try {
    await mongoose.connect(process.env.URI);
    console.log("Connected to MongoDb");
  } catch (error) {
    console.log(error);
  }
};

const mongoose = require("mongoose");

const postsSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  topic: {
    type: String,
    enum: ["politics", "health", "sport", "tech"],
    description: "Must be on of these : Politics, Health, Sport or Tech",
  },
  timeStamp: {
    type: String,
  },
  message: { type: String, required: [true, "Message is required"] },
  expirationTime: {
    type: String,
  },
  live: { type: Boolean, default: true },
  ownerId: {
    type: String,
    require: true,
  },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: {
    type: [String],
    default: [],
  },
});

const Post = mongoose.model("Post", postsSchema);

module.exports = Post;

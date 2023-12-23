const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const verifyToken = require("../verifyToken");
const { postsValidation } = require("../validations/validation");
const getActive = require("../tools/getActive");

const getSetExpiration = async () => {
  try {
    const posts = await Post.find({});
    if (posts) {
      const ids = getActive(posts);
      ids.forEach(async (element) => {
        try {
          await Post.findByIdAndUpdate(element, { live: false }, { new: true });
        } catch (error) {
          return res.send(`ids: ${error}`);
        }
      });
    } else {
      return res.send("No post");
    }
  } catch (error) {
    return res.send(error);
  }
};

router.get("/", verifyToken, async (req, res) => {
  getSetExpiration();
  try {
    const posts = await Post.find({});
    if (posts) {
      return res.status(200).send(posts);
    }
    return res.send("No posts after updating live");
  } catch (error) {
    return res.send(error);
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    return res.status(200).json(post);
  } catch (error) {
    return res.send(error);
  }
});

router.get("/topic/:topic", verifyToken, async (req, res) => {
  const topic = req.params.topic.toLowerCase();

  try {
    const post = await Post.find({ topic: topic });
    return res.status(200).send(post);
  } catch (error) {
    return res.send(error);
  }
});

router.get("/expired/:topic", verifyToken, async (req, res) => {
  getSetExpiration();

  const { topic } = req.params;
  try {
    const posts = await Post.find({ topic: topic, live: false });
    return res.send(posts);
  } catch (error) {
    return res.send(error);
  }
});

router.get("/highest-likes/:topic", verifyToken, async (req, res) => {
  getSetExpiration();

  const { topic } = req.params;
  try {
    const post = await Post.find({ topic: topic }).sort({ likes: -1 }).limit(1);
    return res.send(post);
  } catch (error) {
    return res.send(error);
  }
});

router.put("/actions", verifyToken, async (req, res) => {
  getSetExpiration();

  if (Object.keys(req.body).length === 0) return res.send("Nothing to update");
  const { _id, like, dislike, comment } = req.body;
  try {
    var post = await Post.findById(_id);
    if (!post) return res.status(404).send(`No user with id : ${req.post._id}`);
    if (post.ownerId === req.user._id)
      return res.status(403).send("The owner and can not perform any actions");
    if (!post.live)
      return res.send(
        "This post is not live anymore and can not accept any actions"
      );
  } catch (error) {
    return res.send(error);
  }
  const updatedData = {
    likes: post.likes,
    dislikes: post.dislike,
    comments: post.comments,
  };
  const actionType = {
    like: false,
    dislike: false,
    comment: false,
  };

  if (like === 1) {
    actionType.like = true;
    if (comment) {
      updatedData.likes = updatedData.likes + 1;
      updatedData.comments.push(comment);
      actionType.comment = true;
    } else {
      updatedData.likes = post.likes + like;
    }
  } else if (dislike === 1) {
    actionType.dislike = true;
    if (comment) {
      updatedData.dislikes = post.dislikes + dislike;
      updatedData.comments.push(comment);
      actionType.comment = true;
    } else updatedData.dislikes = post.dislikes + dislike;
  } else {
    updatedData.comments.push(comment);
    actionType.comment = true;
  }

  const updatedPost = await Post.findByIdAndUpdate(_id, updateData, {
    new: true,
  });

  return res.send(updatedPost);
});

router.post("/", verifyToken, async (req, res) => {
  const formData = req.body;
  const currentDateTime = new Date();
  const postData = {
    title: formData.title,
    topic: formData.topic,
    timeStamp: currentDateTime.toString(),
    message: formData.message,
    ownerId: req.user._id,
    live: true,
    expirationTime: formData.expirationTime,
  };

  const { error } = postsValidation(postData);
  if (error) {
    return res.send(error.message);
  }
  try {
    const newPost = await Post.create(postData);
    return res.send(newPost);
  } catch (error) {
    return res.send(error);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndUpdate(id, req.body);
    if (!post) return res.status(404).send(`No post with provided id ${id}`);
    return res.send(post);
  } catch (error) {
    return res.send(error);
  }
});

module.exports = router;

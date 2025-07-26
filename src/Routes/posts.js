import express from "express";
import userAuth from "../Middlewares/userAuth.js";
import PostsModel from "../Models/posts.js";
import upload from "../Middlewares/multer.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { getSocket } from "../utils/socket.js";

const postsRouter = express.Router();

postsRouter.post(
  "/post/createpost",
  userAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const user = req.user;
      const { description } = req.body;
      const file = req.file;
      let imageUrl = "";

      if (file) {
        imageUrl = await uploadOnCloudinary(req.file.path);
      }

      if (!description.trim()) {
        return res
          .status(400)
          .json({ status: 400, error: "description cannot be empty!" });
      }

      const newPost = new PostsModel({
        author: user._id,
        postDescription: description,
        imageUrl,
      });

      const savedPost = await newPost.save();
      res.status(201).json({
        status: 201,
        message: "post successfully created",
        data: savedPost,
      });
    } catch (error) {
      console.log("ERROR in createPost");
      console.log(error);
    }
  }
);

postsRouter.get("/posts", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const page = req.query?.page || 1;
    const skip = (page - 1) * 15;
    const limit = 15;

    const populateSaveDetails = "firstName lastName profileImage headline";

    const posts = await PostsModel.find({})
      .skip(skip)
      .limit(limit)
      .populate("author", populateSaveDetails)
      .populate("comments.user", populateSaveDetails)
      .sort({ createdAt: -1 });

    // const posts = await PostsModel.find({ author: { $ne: user._id } })
    //   .skip(skip)
    //   .limit(limit);

    res.status(201).json({ status: 200, data: posts });
  } catch (error) {
    console.log("error in  get Posts");
    console.log(error);
  }
});

postsRouter.patch("/post/like/:postId", userAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const user = req.user;
    let likeStatus = "liked";
    const populateSaveDetails = "firstName lastName profileImage headline";

    const post = await PostsModel.findById(postId)
      .populate("comments.user", populateSaveDetails)
      .populate("author", populateSaveDetails);

    if (!post) {
      return res
        .status(404)
        .json({ error: "cannot find post or post doesn't exists" });
    }

    if (post.likes.includes(user._id)) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== user._id.toString()
      );
      likeStatus = "Unliked";
    } else {
      post.likes.push(user._id);
    }
    await post.save();

    getSocket().emit("receivedUpdate", post);

    res.status(200).json({ message: `${likeStatus} the post`, data: post });
  } catch (error) {
    console.log("POST LIKE ROUTER");
    console.log(error);
  }
});

postsRouter.patch("/post/comment/:postId", userAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const user = req.user;
    const { comment } = req.body;

    const populateSaveDetails = "firstName lastName profileImage headline";

    if (!comment.trim()) {
      return res
        .status(400)
        .json({ status: 400, error: "comment cannot be empty" });
    }

    const post = await PostsModel.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ error: "post does not exists", status: 404 });
    }

    post.comments.push({
      user: user._id,
      content: comment,
    });

    await post.save();

    const updatedPost = await PostsModel.findById(postId)
      .populate("comments.user", populateSaveDetails)
      .populate("author", populateSaveDetails)
      .sort({ comments: -1 });

    getSocket().emit("receivedUpdate", updatedPost);
    res
      .status(200)
      .json({ data: updatedPost, message: "successfully comment added" });
  } catch (error) {
    console.log("Post comment handler");
    console.log(error);
  }
});

export default postsRouter;

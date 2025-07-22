import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
  },
  { timestamps: true }
);

const PostsSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    postDescription: { type: String, require:true },
    imageUrl: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [ commentSchema ],
  },
  { timestamps: true }
);

const PostsModel = mongoose.model("Posts", PostsSchema);

export default PostsModel;

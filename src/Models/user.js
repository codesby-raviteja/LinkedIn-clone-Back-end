import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    userName: {
      type: String,
      require: true,
      unique: true,
    },
    emailId: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    profileImage: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360",
    },
    coverImage: {
      type: String,
      default:
        "https://thingscareerrelated.com/wp-content/uploads/2021/10/default-background-image.png?w=862",
    },
    headline: {
      type: String,
      default: "",
    },
    skills: [{ type: String }],
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRECT_KEY, {
    expiresIn: "7d",
  });

  return token;
};

const User = mongoose.model("User", userSchema);

export default User;

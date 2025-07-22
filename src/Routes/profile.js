import express from "express"
import userAuth from "../Middlewares/userAuth.js"
import upload from "../Middlewares/multer.js"
import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../Models/user.js"

const profileRoute = express.Router()

profileRoute.get("/profile/data", userAuth, async (req, res) => {
  const user = req.user

  res.status(200).json({ data: user })
})

profileRoute.patch(
  "/profile/edit",
  userAuth,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      let { firstName, lastName, userName, skills, gender, headline } = req.body
      let { profileImage, coverImage } = req.files
      skills = JSON.parse(skills)
      if (profileImage) {
        profileImage = await uploadOnCloudinary(profileImage[0].path)
      }
      if (coverImage) {
        coverImage = await uploadOnCloudinary(coverImage[0].path)
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          firstName,
          lastName,
          userName,
          skills,
          gender,
          profileImage,
          coverImage,
          headline,
        },
        { new: true }
      ).select("-password")
      res.status(200).json({ message: "suceessfully updated", data: user })
    } catch (error) {
      console.log(error.message)
      res.status(200).json({ message: "Internal Server Error" })
    }
  }
)

export default profileRoute

import jwt from "jsonwebtoken"
import User from "../Models/user.js"





console.log('Running USERAUTH file');

const userAuth = async function (req, res, next) {
  const { token } = req.cookies

  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "Please login into your account !" })
    }

    const decryptData = await jwt.verify(token, process.env.JWT_SECRECT_KEY)

    const user = await User.findById(decryptData._id).select("-password")

    if (!user) {
      return res.status(400).json({ message: "user does not exists !" })
    }

    req.user = user

    next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export default userAuth

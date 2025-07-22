import express from "express"
import User from "../Models/user.js"
import bcrypt from "bcrypt"
import { validateSignupData } from "../utils/validations.js"

const authRouter = express.Router()

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req, res)

    const { firstName, lastName, emailId, password, userName } = req.body

    const isEmailExists = await User.findOne({ emailId })
    if (isEmailExists) {
      return res.status(400).json({ message: "Email id already exists !" })
    }
    const isUserNameExists = await User.findOne({ userName })
    if (isUserNameExists) {
      return res.status(400).json({ message: "username already exists !" })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({
      firstName,
      lastName,
      emailId,
      userName,
      password: passwordHash,
    })

    const savedUser = await user.save()

    const token = await savedUser.getJWT()

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    })

    return res.status(201).json(savedUser)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body
    const user = await User.findOne({ emailId })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials !" })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials !" })
    }
    const token = await user.getJWT()
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    })

    res.status(201).json({ message: "login successfull !", data: user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

authRouter.get("/logout", (req, res) => {
  try {
    res.clearCookie("token")
    res.status(200).json({ message: "successfully logged out" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default authRouter

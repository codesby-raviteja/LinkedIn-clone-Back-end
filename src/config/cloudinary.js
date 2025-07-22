import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

const uploadOnCloudinary = async (filepath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_SECRETE_KEY,
  })
  try {
    if (!filepath) return null
    const uploadResult = await cloudinary.uploader.upload(filepath)
    fs.unlinkSync(filepath)
    return uploadResult.secure_url
  } catch (error) {
    fs.unlinkSync(filepath)
    console.log(error, "from upload couln")
  }
}

export default uploadOnCloudinary

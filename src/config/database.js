import mongoose from "mongoose"

const connectDB = async () => {
  const res = await mongoose.connect(process.env.DATABASE_URL)
 
}


export default connectDB
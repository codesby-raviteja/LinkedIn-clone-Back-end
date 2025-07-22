import mongoose from "mongoose";

const connectionsSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  status: { type: String, enum: ["pending", "accepted", "rejected"] },
});

const ConnectionsModel = mongoose.model("Connections", connectionsSchema);

export default ConnectionsModel;

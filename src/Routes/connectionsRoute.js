import express from "express";
import userAuth from "../Middlewares/userAuth.js";
import ConnectionsModel from "../Models/connectionsSchema.js";
import User from "../Models/user.js";

const connectionsRouter = express.Router();

connectionsRouter.get(
  "/check/connection/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { toUserId } = req.params;

      const user = req.user;

      const isConnectionExist = await ConnectionsModel.findOne({
        $or: [
          { toUserId, fromUserId: user._id },
          { fromUserId: toUserId, toUserId: user._id },
        ],
      });

      if (isConnectionExist) {
        return res
          .status(200)
          .json({ message: "connection exists", connectionExists: true });
      }
      return res
        .status(200)
        .json({
          message: "connection does not exists",
          connectionExists: false,
        });
    } catch (error) {
      console.log("Error in check coonection");
      console.log(error);
    }
  }
);

connectionsRouter.post("/connect/:toUserId", userAuth, async (req, res) => {
  try {
    const { toUserId } = req.params;
    const sender = req.user;

    if (toUserId === sender._id.toString()) {
      return res
        .status(400)
        .json({ status: 400, error: "you cannot send request to your self" });
    }

    const receiver = await User.findById(toUserId);

    if (!receiver) {
      return res
        .status(404)
        .json({ status: 404, error: "user does not exitst" });
    }

    const existingConnection = await ConnectionsModel.findOne({
      $or: [
        { toUserId, fromUserId: sender._id },
        { toUserId: sender._id, fromUserId: toUserId },
      ],
    });

    if (existingConnection) {
      return res
        .status(400)
        .json({ status: 400, message: "connection already exits" });
    }

    const newConnection = new ConnectionsModel({
      toUserId,
      fromUserId: sender._id,
      status: "pending",
    });

    await newConnection.save();
    res.status(201).json({
      status: 201,
      message: "request successfully sent",
      data: newConnection,
    });
  } catch (error) {
    console.log("Error in connection router follow path");
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
});

connectionsRouter.patch(
  "/connection/:status/:fromUserId",
  userAuth,
  async (req, res) => {
    try {
      const { status, fromUserId } = req.params;
      const receiver = req.user;

      if (!["accepted", "rejected"].includes(status)) {
        return res
          .status(400)
          .json({ status: 400, error: `invalid status type : ${status}` });
      }

      const existingConnection = await ConnectionsModel.findOne({
        toUserId: receiver._id,
        fromUserId,
        status: "pending",
      });

      if (!existingConnection) {
        return res
          .status(404)
          .json({ status: 400, error: "connection does not exists" });
      }

      if (existingConnection.toUserId.toString() !== receiver._id.toString()) {
        return res.status(403).json({
          status: 403,
          error: "You are not authorized to update this connection",
        });
      }

      existingConnection.status = status;

      await existingConnection.save();

      res.json({
        status: 200,
        data: existingConnection,
        message: `You have ${status} the connection`,
      });
    } catch (error) {
      console.log("ERROR In connection accepting handker");
      res.status(500).json({ status: 500, error: "Internal Server Error" });
    }
  }
);

export default connectionsRouter;

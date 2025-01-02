import mongoose from "mongoose";

export interface NewProjectInterface extends Document {
  name: string;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  status: "ongoing" | "Pending" | "completed";
  users: user[];
  createdAt: string;
  updatedAt?: string;
  deadline?: string;
}

export interface ProjectPayloadInterface {
  name: string;
  userId?: string;
  deadline: string;
  users: user[];
  status?: string;
  updatedBy?:string;
}

interface user {
  _id: string;
  userId: string;
  role: "admin" | "owner" | "user"; // interface for user
}

export const userRole = {
  admin: "admin",
  user: "user",
  owner:"owner"
}
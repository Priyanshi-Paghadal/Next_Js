import mongoose from "mongoose";

export interface NewProjectInterface extends Document {
  name: string;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  status: "ongoing" | "Pending" | "completed";
  user: user[];
  createdAt: string;
  updatedAt?: string;
  deadline?: string;
}

export interface ProjectPayloadInterface  {
    name: string;
    userId: string;
    deadline: string;
    users: user[];
    status?: string
  }
//   export interface ProjectUserInterface {

interface user {
  userId: string;
  role: "admin" | "owner" | "user"; // interface for user
}

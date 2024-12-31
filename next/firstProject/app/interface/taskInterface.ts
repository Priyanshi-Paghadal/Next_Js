import mongoose from "mongoose";

export interface NewTaskInterFace extends Document {
  projectId: string;
  name: string;
  priority: "High" | "Medium" | "Low";
  users: mongoose.Types.ObjectId[];
  dueDate: Date;
  completed?: boolean;
  archive: boolean;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

export interface TaskPayloadInterface {
  projectId: string;
  name: string;
  priority: "High" | "Medium" | "Low";
  users:mongoose.Types.ObjectId[];
  dueDate: Date;
  createdBy: mongoose.Types.ObjectId;
}

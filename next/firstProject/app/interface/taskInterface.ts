import mongoose from "mongoose";

export interface NewTaskInterFace extends Document {
  projectId: mongoose.Types.ObjectId;
  name: string;
  priority: "High" | "Medium" | "Low";
  users: mongoose.Types.ObjectId[];
  dueDate: Date;
  completed: boolean;
  archive: boolean;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

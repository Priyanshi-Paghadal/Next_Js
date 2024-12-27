import mongoose, { Document, Schema, Model } from "mongoose";

export interface NewTaskInterFace extends Document {
  projectId:mongoose.Types.ObjectId;
  name: string;
  priority: "High" | "Medium" | "Low";
  users:mongoose.Types.ObjectId[];
  dueDate:Date;
  completed: boolean;
  archive: boolean;
  userId: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

const taskSchema = new Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    name: { type: String, required: true },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // Assuming 'User' is the name of your user model
        required:true
      },
    ],
    dueDate: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    archive: { type: Boolean, default: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  {
    timestamps: true, // Automatically includes `createdAt` and `updatedAt`
  }
);

const Task: Model<NewTaskInterFace> =
  mongoose.models.Task || mongoose.model<NewTaskInterFace>("Task", taskSchema);

export default Task;

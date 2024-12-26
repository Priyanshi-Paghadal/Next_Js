import mongoose, { Document, Schema, Model } from "mongoose";

export interface NewTaskInterFace extends Document {
  prtId:mongoose.Types.ObjectId;
  name: string;
  priority: "High" | "Medium" | "Low";
  assigned:mongoose.Types.ObjectId[];
  dueDate:Date;
  completed: boolean;
  archive: boolean;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

const taskSchema = new Schema(
  {
    prtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    name: { type: String, required: true },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
    },
    assigned: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming 'User' is the name of your user model
        required:true
      },
    ],
    dueDate: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    archive: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true, // Automatically includes `createdAt` and `updatedAt`
  }
);

const Task: Model<NewTaskInterFace> =
  mongoose.models.Task || mongoose.model<NewTaskInterFace>("Task", taskSchema);

export default Task;

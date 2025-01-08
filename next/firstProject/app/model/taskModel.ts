import mongoose, { Schema, Model } from "mongoose";
import { NewTaskInterFace } from "../interface/taskInterface";

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
        required: true,
      },
    ],
    dueDate: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    archive: { type: Boolean, default: false },
    createdBy: {
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

taskSchema.path("users").validate(function (users: mongoose.Types.ObjectId[]) {
  const userIdsSet = new Set<string>();
  for (const userId of users) {
    if (userIdsSet.has(userId.toString())) {
      return false; // Duplicate userId found
    }
    userIdsSet.add(userId.toString());
  }
  return true; // No duplicates found
}, "Duplicate userId found in users array");

const Task: Model<NewTaskInterFace> =
  mongoose.models.Task || mongoose.model<NewTaskInterFace>("Task", taskSchema);

export default Task;

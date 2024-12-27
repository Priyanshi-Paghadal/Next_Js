import mongoose, { Document, Schema, Model } from "mongoose";
export interface NewProjectInterface extends Document {
  name: string;
  userId: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  status: "ongoing" | "Pending" | "completed"; 
  user: user[];
  createdAt: string;
  updatedAt?: string;
  deadline?: string;
}

interface user {
  userId: string;
  role: "admin" | "owner" | "user"; // interface for user
}

const projectSchema: Schema<NewProjectInterface> = new Schema(
  {
    name: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      enum: ["ongoing", "Pending", "completed"], // Enforce valid enum values
      default: "Pending",
      required: true,
    },
    user: [
      {
        userId: { type: String, required: true },
        role: {
          type: String,
          enum: ["admin", "owner", "user"], // Enforce valid enum values
          required: true,
        },
      },
    ],
    deadline: { type: String }, // Optional field, no `required`
  },
  {
    timestamps: true, // Automatically includes `createdAt` and `updatedAt`
  }
);

// Model Creation
const Project: Model<NewProjectInterface> =
  mongoose.models.Project ||
  mongoose.model<NewProjectInterface>("Project", projectSchema);

export default Project;
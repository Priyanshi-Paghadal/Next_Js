import mongoose, { Model, Schema } from "mongoose";
import { NewProjectInterface } from "../interface/projectInterface";

const projectSchema: Schema<NewProjectInterface> = new Schema(
  {
    name: { type: String, required: true },
    createdBy: {
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
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "users", },
        role: {
          type: String,
          enum: ["admin", "owner", "user"], // Enforce valid enum values
          required: true,
        },
      },
    ],
    deadline: { type: String }, // Optional field, no `required` always date type
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

// Base Interface for the Project Model
// export interface BaseProjectInterface extends Document {
//   _id: mongoose.Types.ObjectId;
//   name: string;
//   userId: mongoose.Types.ObjectId; // Original userId
//   updatedBy?: mongoose.Types.ObjectId;
//   status: "ongoing" | "Pending" | "completed";
//   user: user[];
//   createdAt?: string;
//   updatedAt?: string;
//   deadline?: string;
// }

// // Interface for User in the Project
// interface user {
//   userId: string;
//   role: "admin" | "owner" | "user";
// }

// // Modify Payload: Replace userId with createdBy
// export type NewProjectPayload = Omit<BaseProjectInterface, "userId"> & {
//   createdBy: mongoose.Types.ObjectId;
// };

// // Payload for Updating an Existing Project
// export type UpdateProjectPayload = Partial<
//   Omit<BaseProjectInterface, "_id" | "createdAt" | "updatedAt">
// >;

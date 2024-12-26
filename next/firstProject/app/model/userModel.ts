import mongoose, { Document, Schema, Model } from "mongoose";

export interface NewUserInterface extends Document {
  name: string;
  email: string;
  norEmail: string;
  password: string;
  mobile: number; // Optional mobile number
  gender?: "Male" | "Female" | "Other"; // Enum type for gender
  birthDate?: Date; // Optional birthdate
  age?: number; // Optional age
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<NewUserInterface> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    norEmail: { type: String, required: true },
    password: { type: String, required: true },
    mobile: {
      type: Number,
      required: true,
      validate: {
        validator: (value: number) => /^\d{10}$/.test(value.toString()),
        message: "Mobile number must be exactly 10 digits.",
      },
    }, // Fixed bigint to Number
    gender: { type: String, enum: ["Male", "Female", "Other"] }, // Enum for gender
    birthDate: { type: Date }, // Added Date type for birthdate
    age: { type: Number }, // Added Number type for age
  },
  {
    timestamps: true, // Automatically includes `createdAt` and `updatedAt`
  }
);

const User: Model<NewUserInterface> =
  mongoose.models.User || mongoose.model<NewUserInterface>("User", userSchema);

export default User;

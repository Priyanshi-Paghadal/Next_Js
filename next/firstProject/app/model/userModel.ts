import mongoose, { Schema, Model } from "mongoose";
import { NewUserInterface } from "../interface/userInterface";
import bcrypt from "bcrypt";

const userSchema: Schema<NewUserInterface> = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      set: (value: string) => value.toLowerCase(), // convert to lowercase
      match: [
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        "Please provide a valid email address",
      ], // Email format validation
    },
    norEmail: {
      type: String,
      set: (value: string) => value.toUpperCase(), // convert to uppercase
    },
    password: { type: String, required: true },
    mobile: {
      type: Number,
      required: true,
      validate: {
        validator: (value: number) => /^\d{10}$/.test(value.toString()), // validate mobile number
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

userSchema.pre<NewUserInterface>("save", async function (next) {
  if (this.isModified("password")) { // Only hash if the password has been modified
    const saltRounds = 10; // You can adjust the salt rounds if needed
    try {
      const hashedPassword = await bcrypt.hash(this.password, saltRounds);
      this.password = hashedPassword; // Set the hashed password
      next(); // Proceed with the save
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err:any) {
      next(err); // Pass any errors to the next middleware
    }
  } else {
    next(); // If password is not modified, just proceed with the save
  }
});


userSchema.pre<NewUserInterface>("validate", function (next) {
  // Compare email and norEmail after applying transformations
  if (this.email) {
    this.norEmail = this.email.toUpperCase() 
  }
  next();
}); //validate email

userSchema.pre<NewUserInterface>("save", function (next) {
  console.log("BirthDate:", this.birthDate); // Debugging
  if (this.birthDate) {
    const diff = Date.now() - new Date(this.birthDate).getTime();
    this.age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }
  next();
}); //find age from birth date

const User: Model<NewUserInterface> =
  mongoose.models.User || mongoose.model<NewUserInterface>("User", userSchema);

export default User;
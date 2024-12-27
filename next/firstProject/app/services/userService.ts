import bcrypt from "bcrypt";
import User, { NewUserInterface } from "../model/userModel";

export const createUser = async (userData: {
  name: string;
  email: string;
  norEmail: string;
  password: string;
  mobile: number;
  gender: string;
  birthDate: Date;
  age?: number;
}) => {
  try {
    if (!/^\d{10}$/.test(userData.mobile.toString())) {
      throw new Error("Mobile number must be exactly 10 digits."); // validate mobile number
    }
    userData.password = await bcrypt.hash(userData.password, 10); //hash password
    const user = new User(userData);
    await user.save(); // save user to database
    return user; //return the newly created user
  } catch (error) {
    throw new Error(`Error creating user: ${error}`);
  }
};

export const getUser = async (): Promise<NewUserInterface[]> => {
  try {
    const users = await User.find(); //get data
    return users;
  } catch (error) {
    throw new Error(`Error creating user: ${error}`);
  }
};

export const updateUser = async (
  id: string,
  updatedData: { name?: string; email?: string; password?: string }
): Promise<NewUserInterface | null> => {
  try {
    if (!id) {
      throw new Error("User ID is required for updating."); //validate id
    }

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10); // hash password
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: id }, // Match document by _id
      { $set: updatedData }, // Use $set to apply updates
      { new: true } // Return the updated document
    ).exec();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error(`Error updating user: ${error}`);
  }
};

import bcrypt from "bcrypt";
import User, { NewUserInterface } from "../model/userModel";

export const createUser = async (userData: NewUserInterface) => {
  try {
    if (!/^\d{10}$/.test(userData.mobile.toString())) {
      throw new Error("Mobile number must be exactly 10 digits.");
    }
    userData.password = await bcrypt.hash(userData.password, 10);
    if (userData.birthDate) {
      // Calculate the current year
      const currentYear = new Date().getFullYear();
      // Extract the year from the birthDate
      const birthYear = new Date(userData.birthDate).getFullYear();
      // Calculate age
      userData.age = currentYear - birthYear;
    }
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    throw new Error(`Error creating user: ${error}`);
  }
};

export const getUser = async (): Promise<NewUserInterface[]> => {
  try {
    const users = await User.find();
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
      throw new Error("User ID is required for updating.");
    }

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
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

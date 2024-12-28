import bcrypt from "bcrypt";
import User from "../model/userModel";
import { NewUserInterface } from "../interface/userInterface";
import { messages } from "../helper/messageHelper";

export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  mobile: number;
  gender: string;
  birthDate: Date;
}) => {
  try {
    userData.password = await bcrypt.hash(userData.password, 10); //hash password
    const user = new User(userData);
    await user.save(); // save user to database
    return user; //return the newly created user
  } catch (error) {
    console.log(`Error creating user: ${error}`);
    throw error;
  }
};

export const getUser = async (): Promise<NewUserInterface[]> => {
  try {
    const users = await User.find(); //get data
    return users;
  } catch (error) {
    console.log(`Error getting user: ${error}`);
    throw error;
  }
};

export const updateUser = async (
  id: string,
  updatedData: { name?: string; email?: string; password?: string }
): Promise<NewUserInterface | null> => {
  try {
    if (!id) {
      throw new Error(messages.id.required); //validate id
    }

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10); // hash password
    }

    const updateResult = await User.updateOne(
      { _id: id }, // Match document by _id
      { $set: updatedData } // Use $set to apply updates
    );
    if (updateResult.modifiedCount === 0) {
      return null; // No document updated, return null
    }

    // Optionally, fetch the updated user document after the update
    const updatedUser = await User.findOne({ _id: id });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const getUserDetails = async (userId:string ): Promise<NewUserInterface|null> => {
  try {
    const user = await User.findOne({_id:userId}); //get data
    if(user)return user;
    else return null;
  } catch (error) {
    console.log(`Error getting user: ${error}`);
    throw error;
  }
};
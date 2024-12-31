import User from "../model/userModel";
import {
  NewUserInterface,
  UserPayLoadInterface,
} from "../interface/userInterface";
import { messages } from "../helper/messageHelper";
import { validateUsers } from "../utils/validate";

export const createUser = async (payload: UserPayLoadInterface) => {
  try {
    const { name, email, password, mobile, gender, birthDate } = payload;
    validateUsers(payload);

    const newUser = {
      name,
      email,
      password,
      mobile,
      gender,
      birthDate,
    };
    const user = new User(newUser);
    await user.save(); // save user to database
    return user; //return the newly created user
  } catch (error) {
    console.log(`Error creating user: ${error}`);
    throw error;
  }
};

export const getUsers = async (): Promise<NewUserInterface[]> => {
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
  updatedData: {
    name?: string;
    email?: string;
    password?: string;
    mobile?: string;
    gender?: string;
    birthDate?: string;
  }
): Promise<NewUserInterface | null> => {
  try {
    if (!id) {
      throw new Error(messages.id.required); //validate id
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

export const getUserDetails = async (
  userId: string
): Promise<NewUserInterface | null> => {
  try {
    const user = await User.findOne({ _id: userId }); //get data
    if (user) return user;
    else return null;
  } catch (error) {
    console.log(`Error getting user: ${error}`);
    throw error;
  }
};

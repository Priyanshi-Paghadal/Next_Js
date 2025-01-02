import User from "../model/userModel";
import {
  NewUserInterface,
  UserPayLoadInterface,
} from "../interface/userInterface";
import { messages } from "../helper/messageHelper";
// import { validateUsers } from "../utils/validate";

// export const createUser = async (
//   payload: UserPayLoadInterface
// ): Promise<UserPayLoadInterface> => {
//   try {
//     console.time("CreateUser:::");

//     // await validateUsers(payload);

//     console.log(":::::::payload", payload);

//     const user = await new User(payload).save();
//     console.log("::::createuser", user);
//     console.timeEnd("CreateUser:::");
//     return user; //return the newly created user
//   } catch (error) {
//     console.log(`Error creating user: ${error}`);
//     throw error;
//   }
// };

export const createUser = async (payload: UserPayLoadInterface, p0: Express.Multer.File): Promise<UserPayLoadInterface> => {
  try {
    console.time("CreateUser:::");

    console.log(":::::::payload", payload);

    const user = await new User(payload).save();
    console.log("::::createuser", user);
    console.timeEnd("CreateUser:::");

    return user; // Return the newly created user
  } catch (error) {
    console.log(`Error creating user: ${error}`);
    throw error;
  }
};

export const getUsers = async (): Promise<NewUserInterface[]> => {
  try {
    console.time("getuser::::");
    const users = await User.find(); //get data
    console.timeEnd("getuser::::");
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
    console.time("updateUser:::");
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
    console.timeEnd("updateUser:::");
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

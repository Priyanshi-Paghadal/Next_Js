import User from "../model/userModel";
import {
  NewUserInterface,
  UserPayLoadInterface,
} from "../interface/userInterface";
import { messages } from "../helper/messageHelper";
import { validateUsers } from "../utils/validate";
import path from "path";
import fs from "fs";

export async function createUser(
  data: UserPayLoadInterface,
  profilePicFile: Express.Multer.File
): Promise<unknown> {
  try {
    const { name, email, password, mobile, gender, birthDate } = data;

    const userImagePath = `public/uploads/${profilePicFile.name}`;
    console.log("iuserimage path:::", userImagePath);
    const img = await imageToBase64(userImagePath);

    const newUser = new User({
      name,
      email,
      password,
      mobile,
      gender,
      birthDate,
      profilePic: img,
    });
    validateUsers(newUser);

    await newUser.save();
    return newUser;
  } catch (error) {
    console.log("Error creating user: ", error);
    throw error;
  }
}

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

export async function imageToBase64(imagePath: string): Promise<string> {
  console.log("Received image path:", imagePath);

  try {
    // Resolve the absolute path
    const resolvedPath = path.resolve(imagePath);
    console.log("Resolved image path:", resolvedPath);

    // Check if the file exists
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`File does not exist at path: ${resolvedPath}`);
    }

    // Read image as a binary file
    const imageBuffer = fs.readFileSync(resolvedPath);

    // Convert the binary data to Base64 string
    const base64Image = imageBuffer.toString("base64");

    // Prepend the MIME type if needed
    const base64String = `data:image/jpeg;base64,${base64Image}`;
    console.log("Base64 conversion successful");

    return base64String;
  } catch (error) {
    // In case the error is not an instance of Error
    console.error("base64 not converted", error);
    throw Error("base64 not converted");
  }
}

import Task from "../model/taskModel";
import { NewTaskInterFace } from "../interface/taskInterface";
import mongoose from "mongoose";
import { messages } from "../helper/messageHelper";

export const createTask = async (taskData: {
  projectId: mongoose.Types.ObjectId;
  name: string;
  priority: "High" | "Medium" | "Low";
  users: mongoose.Types.ObjectId[];
  dueDate: Date;
  completed: boolean;
  archive: boolean;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}) => {
  try {
    // Create a new task using the Task model
    const newTask = await Task.create(taskData);
    return newTask;
  } catch (error) {
    console.log("Error creating task", error);
    throw error;
  }
};

export const getTask = async (): Promise<NewTaskInterFace[]> => {
  try {
    const allTasks = await Task.find({});
    console.log("Fetched tasks:", allTasks); // Debug log
    return allTasks;
  } catch (error) {
    console.log("Error getting tasks", error);
    throw error;
  }
};

export const updateTask = async (
  id: string,
  updatedData: {
    projectId: mongoose.Types.ObjectId;
    name?: string;
    priority?: "High" | "Medium" | "Low";
    users?: mongoose.Types.ObjectId[]; // Array of ObjectIds for 'users'
    dueDate?: Date;
    updatedBy?: mongoose.Types.ObjectId;
  }
): Promise<NewTaskInterFace | null> => {
  try {
    if (!id) {
      throw new Error(messages.id.required);
    }
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id }, // Match document by _id
      { $set: updatedData }, // Use $set to apply updates
      { new: true } // Return the updated document
    ).exec();
    return updatedTask;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

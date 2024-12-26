import Task from "../model/taskModel";
import { NewTaskInterFace } from "../model/taskModel";
import mongoose from "mongoose";

export const createTask = async (
  taskData: NewTaskInterFace
): Promise<NewTaskInterFace | null> => {
  try {
    // Create a new task using the Task model
    const newTask = await Task.create(taskData);
    return newTask;
  } catch (error) {
    throw new Error(`Error creating task: ${error}`);
  }
};

export const getTask = async (): Promise<NewTaskInterFace[]> => {
  try {
    const allTasks = await Task.find({})
      // .populate("assigned") // Populate the 'assigned' field with the associated User data
      // .exec();
    console.log("Fetched tasks:", allTasks); // Debug log
    return allTasks;
  } catch (error) {
    throw new Error(`Error getting tasks: ${error}`);
  }
};

export const updateTask = async (
  id: string,
  updatedData: {
    prtId:mongoose.Types.ObjectId;
    name?: string;
    priority?: "High" | "Medium" | "Low";
    assigned?: mongoose.Types.ObjectId[]; // Array of ObjectIds for 'assigned'
    dueDate?: Date;
    updatedBy?: mongoose.Types.ObjectId;
  }
): Promise<NewTaskInterFace | null> => {
  try {
    if (!id) {
      throw new Error("Task ID is required for updating.");
    }
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id }, // Match document by _id
      { $set: updatedData }, // Use $set to apply updates
      { new: true } // Return the updated document
    ).exec();
    return updatedTask;
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error(`Error updating task: ${error}`);
  }
};

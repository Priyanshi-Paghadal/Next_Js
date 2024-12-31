import Task from "../model/taskModel";
import {
  NewTaskInterFace,
  TaskPayloadInterface,
} from "../interface/taskInterface";
import mongoose from "mongoose";
import { messages } from "../helper/messageHelper";
import { validateTasks } from "../utils/validate";

export const createTask = async (payload: TaskPayloadInterface) => {
  try {
    // Create a new task using the Task model
    const { projectId, name, priority, users, dueDate, createdBy } = payload;
    validateTasks(payload);

    const addTask = {
      projectId,
      name,
      priority,
      users,
      dueDate,
      createdBy,
    };
    addTask.users = [...new Set(addTask.users.map((id) => id))];
    const newTask = await Task.create(addTask);
    const populatedTask = await getTaskDetails(newTask._id);
    return populatedTask;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export const getTaskDetails = async (taskId: mongoose.Types.ObjectId) => {
  try {
    const populatedTask = await Task.aggregate([
      { $match: { _id: taskId } }, // Match newly created project
      // Lookup for creatorDetails (userId)
      {
        $lookup: {
          from: "users", // Collection name for users
          localField: "users",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $group: {
          _id: "$_id",
          projectId: { $first: "$projectId" },
          name: { $first: "$name" },
          priority: { $first: "$priority" },
          dueDate: { $first: "$dueDate" },
          userDetails: { $addToSet: "$userDetails" }, // Deduplicate user details
          creatorDetails: { $first: "$creatorDetails" },
          updatedDetails: { $first: "$updatedDetails" },
        },
      },
      {
        $project: {
          _id: 1,
          projectId: 1,
          name: 1,
          priority: 1,
          dueDate: 1,
          userDetails: {
            _id: 1,
            name: 1,
            email: 1,
          },
          creatorDetails: {
            _id: 1,
            name: 1,
            email: 1,
          },
          updatedDetails: {
            _id: 1,
            name: 1,
            email: 1,
          },
        },
      },
    ]);

    return populatedTask[0];
  } catch (error) {
    throw error;
  }
};

export const getTasks = async (): Promise<NewTaskInterFace[]> => {
  try {
    const allTasks = await Task.aggregate([
      {
        $lookup: {
          from: "users", // Name of the collection for users
          localField: "createdBy", // Field in the Project model
          foreignField: "_id", // Field in the User model
          as: "creatorDetails", // Output array for creator details
        },
      },
      {
        $unwind: {
          path: "$creatorDetails", // Unwind creator details to simplify projection
          preserveNullAndEmptyArrays: true, // Keep projects even if creator is null
        },
      },
      // Lookup for updatedBy details
      {
        $lookup: {
          from: "users", // Name of the collection for users
          localField: "updatedBy", // Field in the Project model
          foreignField: "_id", // Field in the User model
          as: "updatedDetails", // Output array for updatedBy details
        },
      },
      {
        $unwind: {
          path: "$updatedDetails", // Unwind updatedBy details to simplify projection
          preserveNullAndEmptyArrays: true, // Keep projects even if updatedBy is null
        },
      },
      // Project only required fields
      {
        $lookup: {
          from: "users", // Name of the collection for users
          localField: "users", // Field in Task model (array of user IDs)
          foreignField: "_id", // Field in User model
          as: "userDetails", // Output array for user details
        },
      },
      {
        $group: {
          _id: "$_id", // Group by task ID
          projectId: { $first: "$projectId" },
          name: { $first: "$name" },
          priority: { $first: "$priority" },
          dueDate: { $first: "$dueDate" },
          userDetails: { $first: "$userDetails" }, // Keep array of users
          creatorDetails: { $first: "$creatorDetails" }, // Keep creator details
          updatedDetails: { $first: "$updatedDetails" }, // Keep updatedBy details
        },
      },
      {
        $project: {
          _id: 1,
          projectId: 1,
          name: 1,
          priority: 1,
          dueDate: 1,
          userDetails: {
            _id: 1,
            name: 1,
            email: 1,
          },
          creatorDetails: {
            _id: 1,
            name: 1,
            email: 1,
          },
          updatedDetails: {
            _id: 1,
            name: 1,
            email: 1,
          },
        },
      },
    ]);

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
    projectId: string;
    name: string;
    priority: string;
    users: string;
    dueDate: string;
    updatedBy: string;
    completed: boolean;
    archive: boolean;
  }
): Promise<NewTaskInterFace | null> => {
  try {
    if (!id) {
      throw new Error(messages.id.required);
    }
    if (!updatedData.updatedBy) {
      throw new Error(messages.updatedBy.required);
    }
    const updateResult = await Task.updateOne(
      { _id: id }, // Match document by _id
      { $set: updatedData } // Use $set to apply updates
    );

    if (updateResult.modifiedCount === 0) {
      return null; // Return null if no document was updated
    }
    const updatedTask = await Task.findById(id); // Or use aggregation if you want to populate the task

    return updatedTask; // Return the updated task document
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

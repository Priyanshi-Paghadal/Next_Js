import Project from "../model/projectModel";
import {
  NewProjectInterface,
  ProjectPayloadInterface,
} from "../interface/projectInterface";
import mongoose from "mongoose";
import { messages } from "../helper/messageHelper";
import { validateProjects } from "../utils/validate";
import { getUserDetails } from "./userService";

export const createProject = async (payload: ProjectPayloadInterface) => {
  try {
    // Create a new task using the Task model
    const { name, userId, status, users, deadline } = payload;
    await validateProjects(payload);

    const newProject = {
      name,
      status,
      users,
      deadline,
      createdBy: userId,
      updatedBy: userId,
    };
    const addedUserIds = new Set<string>();
    for (const user of users) {
      const isExistUser = await getUserDetails(user.userId);
      if (!isExistUser) {
        throw new Error(messages.user.notFound);
      } else {
        newProject.users.push(user); // Add valid user to the project payload
        addedUserIds.add(user.userId);
      }
    }
    const project = await Project.create(newProject);
    console.log(project);
    const populatedProject = await getProjectDetails(project._id);
    return populatedProject;
  } catch (error) {
    throw error;
  }
};

export const getProjectDetails = async (projectId: mongoose.Types.ObjectId) => {
  try {
    const populatedProject = await Project.aggregate([
      { $match: { _id: projectId } }, // Match newly created project
      // Lookup for creatorDetails (userId)
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "creatorDetails",
        },
      },
      {
        $unwind: { path: "$creatorDetails", preserveNullAndEmptyArrays: true },
      },
      // Lookup for updatedBy details
      {
        $lookup: {
          from: "users",
          localField: "updatedBy",
          foreignField: "_id",
          as: "updatedDetails",
        },
      },
      {
        $unwind: { path: "$updatedDetails", preserveNullAndEmptyArrays: true },
      },
      // Project only required fields
      {
        $project: {
          _id: 1,
          name: 1,
          status: 1,
          deadline: 1,
          user: 1,
          "creatorDetails._id": 1,
          "creatorDetails.name": 1,
          "creatorDetails.email": 1,
          "updatedDetails._id": 1,
          "updatedDetails.name": 1,
          "updatedDetails.email": 1,
        },
      },
    ]);

    return populatedProject[0];
  } catch (error) {
    throw error;
  }
};

export const getProject = async () => {
  try {
    const projects = await Project.aggregate([
      // Lookup for creatorDetails (userId)
      {
        $lookup: {
          from: "users", // Name of the collection for users
          localField: "userId", // Field in the Project model
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
        $project: {
          _id: 1, // Include project ID
          name: 1, // Include project name
          status: 1, // Include project status
          deadline: 1, // Include project deadline
          user: 1,
          "creatorDetails._id": 1, // Include only ID from creatorDetails
          "creatorDetails.name": 1, // Include only name from creatorDetails
          "creatorDetails.email": 1, // Include only email from creatorDetails
          "updatedDetails._id": 1, // Include only ID from updatedDetails
          "updatedDetails.name": 1, // Include only name from updatedDetails
          "updatedDetails.email": 1, // Include only email from updatedDetails
        },
      },
    ]);

    return projects;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateProject = async (
  id: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updatedData: any
): Promise<NewProjectInterface | null> => {
  try {
    if (!id) {
      throw new Error(messages.id.required);
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: id }, // Match document by _id
      { $set: updatedData }, // Use $set to apply updates
      { new: true } // Return the updated document
    ).exec();

    if (!updatedProject) {
      return null;
    }

    const populatedProject = await Project.aggregate([
      { $match: { _id: updatedProject._id } }, // Match the updated project by ID
      {
        $lookup: {
          from: "users", // Lookup the 'users' collection
          localField: "userId", // Project's userId field
          foreignField: "_id", // Match with User _id field
          as: "creatorDetails", // Output array for creator details
        },
      },
      {
        $unwind: {
          path: "$creatorDetails", // Unwind to extract single object
          preserveNullAndEmptyArrays: true, // Preserve if creator details are null
        },
      },
      {
        $lookup: {
          from: "users", // Lookup the 'users' collection again for updatedBy field
          localField: "updatedBy", // Project's updatedBy field
          foreignField: "_id", // Match with User _id field
          as: "updatedDetails", // Output array for updated details
        },
      },
      {
        $unwind: {
          path: "$updatedDetails", // Unwind to extract single object
          preserveNullAndEmptyArrays: true, // Preserve if updated details are null
        },
      },
      {
        $project: {
          _id: 1, // Project ID
          name: 1, // Project name
          status: 1, // Project status
          deadline: 1, // Project deadline
          user: 1,
          "creatorDetails._id": 1, // Creator id
          "creatorDetails.name": 1, // Creator name
          "creatorDetails.email": 1, // Creator email
          "updatedDetails._id": 1, // Include only ID from updatedDetails
          "updatedDetails.name": 1, // UpdatedBy name
          "updatedDetails.email": 1, // UpdatedBy email
        },
      },
    ]);

    // Return the populated project with creator and updated details
    return populatedProject[0];
  } catch (error) {
    console.error("Error updating Project:", error);
    throw error;
  }
};

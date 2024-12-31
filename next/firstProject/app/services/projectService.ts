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
    const { name, userId, users = [], deadline } = payload;
    await validateProjects(payload);

    // const addedUserIds = new Set<string>();
    const validUsers: {
      userId: string | undefined;
      role: "admin" | "owner" | "user";
    }[] = []; // Temporary array to store valid users

    const isCreatorAlreadyAdded = users.some((user) => user.userId === userId);
    const isOwnerAlreadyAdded = validUsers.some(
      (user) => user.role === "owner"
    );

    if (!isCreatorAlreadyAdded) {
      if (isOwnerAlreadyAdded) {
        // The owner is already in the list, so you should not change their role.
        console.log(
          "Owner already exists, cannot change the role of the creator."
        );
        // throw new Error(messages.projectOwnerAlreadyExists);
      } else {
        // If the user is the first one to be added (the creator), assign them the "owner" role
        validUsers.push({ userId, role: "owner" });
      }
    } else {
      validUsers.push({ userId, role: "owner" });
    }

    for (const user of users) {
      const isExistUser = await getUserDetails(user.userId);
      const isUserAlreadyAdded = validUsers.some(
        (validUser) => validUser.userId === user.userId
      );
      if (isExistUser && !isUserAlreadyAdded) {
        validUsers.push({
          userId: user.userId,
          role: user.role,
        });
      }
    }

    const newProject = {
      name,
      users: validUsers,
      deadline,
      createdBy: userId,
      updatedBy: userId,
    };
    const project = await Project.create(newProject);
    console.log(project);
    const populatedProject = await getProjectDetails(project._id);
    return populatedProject;
  } catch (error) {
    throw error;
  }
};

export const getProjects = async () => {
  try {
    console.time("Time ::");

    const projects = await Project.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "users.userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "creatorDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "updatedBy",
          foreignField: "_id",
          as: "updatedDetails",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          status: 1,
          deadline: 1,
          users: {
            $map: {
              input: "$users",
              as: "projectUser",
              in: {
                userId: "$$projectUser.userId",
                role: "$$projectUser.role",
                name: {
                  $arrayElemAt: [
                    "$userDetails.name",
                    {
                      $indexOfArray: [
                        "$userDetails._id",
                        "$$projectUser.userId",
                      ],
                    },
                  ],
                },
                email: {
                  $arrayElemAt: [
                    "$userDetails.email",
                    {
                      $indexOfArray: [
                        "$userDetails._id",
                        "$$projectUser.userId",
                      ],
                    },
                  ],
                },
              },
            },
          },
          "creatorDetails.name": 1,
          "creatorDetails.email": 1,
          "creatorDetails.role": "owner",
          "updatedDetails.name": 1,
          "updatedDetails.email": 1,
          "updatedDetails.role": 1,
        },
      },
    ]); // Use lean() for faster response and less overhead

    console.timeEnd("Time ::");
    return projects;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getProjectDetails = async (projectId: mongoose.Types.ObjectId) => {
  try {
    console.time("getData*****");
    const populatedProject = await Project.aggregate([
      { $match: { _id: projectId } }, // Match the project by ID

      {
        $lookup: {
          from: "users",
          localField: "users.userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "creatorDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "updatedBy",
          foreignField: "_id",
          as: "updatedDetails",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          status: 1,
          deadline: 1,
          users: {
            $map: {
              input: "$users",
              as: "projectUser",
              in: {
                userId: "$$projectUser.userId",
                role: "$$projectUser.role",
                name: {
                  $arrayElemAt: [
                    "$userDetails.name",
                    {
                      $indexOfArray: [
                        "$userDetails._id",
                        "$$projectUser.userId",
                      ],
                    },
                  ],
                },
                email: {
                  $arrayElemAt: [
                    "$userDetails.email",
                    {
                      $indexOfArray: [
                        "$userDetails._id",
                        "$$projectUser.userId",
                      ],
                    },
                  ],
                },
              },
            },
          },
          "creatorDetails.name": 1,
          "creatorDetails.email": 1,
          "creatorDetails.role": "owner",
          "updatedDetails.name": 1,
          "updatedDetails.email": 1,
          "updatedDetails.role": 1,
        },
      },
    ]);
    console.timeEnd("getData*****");

    return populatedProject[0];
  } catch (error) {
    throw error;
  }
};

export const updateProject = async (
  id: string,
  updatedData: ProjectPayloadInterface,
  userId: mongoose.Types.ObjectId // User who is attempting to update the project
): Promise<NewProjectInterface | null> => {
  try {
    console.time("12345");
    if (!id) {
      throw new Error(messages.id.required);
    }
    const project = await Project.findById(id);

    if (!project) {
      throw new Error(messages.project.notFound);
    }

    const userRole = project.users.find(
      (user) => user.userId.toString() === userId.toString()
    )?.role;

    if (userRole !== "admin" && userRole !== "owner") {
      throw new Error("not Allowed"); // You can create a message like "Only owners or admins can update the project."
    }

    const currentUsers = project.users || [];
    const newUsers = updatedData.users || [];

    const ownerId = project.createdBy.toString();

    const mergedUsers = [...currentUsers];

    for (const newUser of newUsers) {
      const existingUserIndex = mergedUsers.findIndex(
        (user) => user.userId.toString() === newUser.userId.toString()
      );

      if (existingUserIndex > -1) {
        if (mergedUsers[existingUserIndex].userId.toString() === ownerId) {
          // Skip updating the owner's role
          continue;
        }
        // Update role if the user already exists and is not the owner
        mergedUsers[existingUserIndex].role = newUser.role;
      } else {
        // Add new user to the list
        mergedUsers.push(newUser);
      }
    }

    updatedData.users = mergedUsers;

    await Project.updateOne(
      { _id: id },
      {
        $set: { ...updatedData, updatedBy: userId },
      }
    );

    const populatedProject = await Project.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } }, // Match the updated project by ID
      {
        $lookup: {
          from: "users",
          localField: "users.userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "creatorDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "updatedBy",
          foreignField: "_id",
          as: "updatedDetails",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          status: 1,
          deadline: 1,
          users: {
            $map: {
              input: "$users",
              as: "projectUser",
              in: {
                userId: "$$projectUser.userId",
                role: "$$projectUser.role",
                name: {
                  $arrayElemAt: [
                    "$userDetails.name",
                    {
                      $indexOfArray: [
                        "$userDetails._id",
                        "$$projectUser.userId",
                      ],
                    },
                  ],
                },
                email: {
                  $arrayElemAt: [
                    "$userDetails.email",
                    {
                      $indexOfArray: [
                        "$userDetails._id",
                        "$$projectUser.userId",
                      ],
                    },
                  ],
                },
              },
            },
          },
          "creatorDetails.name": 1,
          "creatorDetails.email": 1,
          "creatorDetails.role": "owner",
          "updatedDetails.name": 1,
          "updatedDetails.email": 1,
          "updatedDetails.role": 1,
        },
      },
    ]);
    console.timeEnd("12345");
    // Return the populated project with creator and updated details
    return populatedProject[0];
  } catch (error) {
    console.error("Error updating Project:", error);
    throw error;
  }
};
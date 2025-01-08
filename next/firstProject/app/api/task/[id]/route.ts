import connectDB from "@/app/lib/connectDb";
import { getProjectAndTaskDetails, updateTask } from "@/app/services/taskService";
import { NextResponse } from "next/server";
import { validate } from "@/app/utils/validate";
import { messages } from "@/app/helper/messageHelper";
import mongoose from "mongoose";

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB(); // Ensure database connection
    const { id } = params; // Get user ID from URL params (dynamic route)
    const {
      projectId,
      name,
      priority,
      users,
      dueDate,
      updatedBy,
      completed,
      archive,
    } = await req.json(); // Parse the body for updated data

    const updatedData = {
      projectId,
      name,
      priority,
      users,
      dueDate,
      updatedBy,
      completed,
      archive,
    };

    validate(id, updatedData);

    const updatedTask = await updateTask(id, updatedData); // Pass parameters correctly

    if (!updatedTask) {
      throw new Error(messages.task.notAdded);
    }

    return NextResponse.json(
      { msg: messages.task.updated, updatedTask },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { msg: messages.task.notUpdated },
      { status: 500 }
    );
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB(); // Connect to the database

    const { id } = params; // Get the projectId from params
    console.log("Project ID ::::::", id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ msg: "Invalid project ID" }, { status: 400 });
    }

    const projectDetails = await getProjectAndTaskDetails(id.toString());

    console.log("ProjectDetails :: ", projectDetails);

    if (!projectDetails) {
      return NextResponse.json({ msg: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(
      { msg: "Project details fetched", data: projectDetails },
      { status: 200 }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching project details:", error);
    return NextResponse.json(
      { msg: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
};

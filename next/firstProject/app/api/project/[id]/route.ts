import connectDB from "@/app/lib/connectDb";
import {
  getUserProjectAndTaskDetails,
  updateProject,
} from "@/app/services/projectService";
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

    console.log(id,":::::::id");

    const body = await req.json();
    const { name, status, users, deadline, userId } = body || {};
    console.log(":::::Body :- ", body);
    // Validate input data

    const updateDetail = {
      name,
      status,
      users,
      deadline,
      userId,
    };

    validate(id, updateDetail);

    // Update the project
    const updatedProject = await updateProject(id, updateDetail, userId);

    if (!updatedProject) {
      throw new Error(messages.project.notFound);
    }

    return NextResponse.json(
      { msg: messages.project.updated, updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating Project:", error);
    return NextResponse.json({ msg: "Project not updated", error });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { id :string } }
) => {
  try {
    await connectDB(); // Connect to the database

    const { id } =  params; // Get the userId from params
    console.log("User Id ::::::", id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ msg: "Invalid user ID" }, { status: 400 });
    }

    const userDetails = await getUserProjectAndTaskDetails(id.toString());

    console.log("UserDetails :: ", userDetails);

    if (!userDetails) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { msg: "User details fetched", data: userDetails },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { msg: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
};

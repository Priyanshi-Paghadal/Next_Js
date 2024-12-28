import { NextResponse } from "next/server";
import connectDB from "@/app/lib/connectDb";
import { createProject, getProject } from "@/app/services/projectService";
import {
  ProjectPayloadInterface,
} from "@/app/interface/projectInterface";
import { messages } from "@/app/helper/messageHelper";

export const POST = async (req: Request) => {
  try {
    await connectDB();
    const { name, userId, status, users, deadline }: ProjectPayloadInterface =
      await req.json();

    const projectDetails = {
      name,
      userId,
      status,
      users,
      deadline,
    };

    // Pass the variable to createProject
    const project = await createProject(projectDetails);

    return NextResponse.json({ msg: messages.project.created, project });
  } catch (error) {
    console.log("Project Not added ", error);
    return NextResponse.json(error);
  }
};

export const GET = async () => {
  try {
    await connectDB();
    const projects = await getProject();
    return NextResponse.json({
      msg: messages.project.created,
      projects,
    });
  } catch (error) {
    console.log("Project Not Found ", error);
    return NextResponse.json(
      { msg: "Error geting project", error },
      { status: 500 }
    );
  }
};

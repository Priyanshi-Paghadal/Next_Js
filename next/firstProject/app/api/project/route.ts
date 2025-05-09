import { NextResponse } from "next/server";
import connectDB from "@/app/lib/connectDb";
import { createProject, getProjects } from "@/app/services/projectService";
import {
  ProjectPayloadInterface,
} from "@/app/interface/projectInterface";
import { messages } from "@/app/helper/messageHelper";

export const POST = async (req: Request) => {
  try {
    await connectDB();
    const payload: ProjectPayloadInterface =
      await req.json();

    // Pass the variable to createProject
    const project = await createProject(payload);

    return NextResponse.json({ msg: messages.project.created, project });
  } catch (error) {
    console.log("Project Not added ", error);
    return NextResponse.json(error);
  }
};

export const GET = async () => {
  try {
    await connectDB();
    const projects = await getProjects();
    return NextResponse.json({
      msg: messages.project.retrived,
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
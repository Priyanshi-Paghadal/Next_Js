import { NextResponse } from "next/server";
import connectDB from "@/app/lib/connectDb";
import { createProject , getProject } from "@/app/services/projectService";

export const POST = async (req: Request) => {
  try {
    await connectDB();
    const { name, createdBy, updatedBy, status, mbr, deadline } =
      await req.json();

    const project = await createProject({
      name,
      createdBy,
      updatedBy: createdBy,
      status,
      mbr,
      deadline,
    });

    return NextResponse.json({ msg: "Project added successfully", project });
  } catch (error) {
    console.log("Project Not added ", error);
    return NextResponse.json(
      { msg: "Error adding project", error: error.message },
      { status: 500 }
    );
  }
};

export const GET = async (req: Request) => {
  try {
    await connectDB();
    const projects = await getProject();
    return NextResponse.json({
      msg: "Projects fetched successfully",
      projects,
    });
  } catch (error) {
    console.log("Project Not Found ", error);
    return NextResponse.json(
      { msg: "Error geting project", error: error.message },
      { status: 500 }
    );
  }
};

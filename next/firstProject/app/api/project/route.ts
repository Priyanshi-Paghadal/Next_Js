import { NextResponse } from "next/server";
import connectDB from "@/app/lib/connectDb";
import { createProject, getProject } from "@/app/services/projectService";
import { NewProjectInterface } from "@/app/model/projectModel";
import { Types } from "mongoose";

export const POST = async (req: Request) => {
  try {
    await connectDB();
    const { name, userId, status, user, deadline }: NewProjectInterface =
      await req.json();

    validateInputs(name, userId, user, deadline);

    const project = await createProject({
      name,
      userId,
      updatedBy: userId,
      status,
      user,
      deadline,
    });

    return NextResponse.json({ msg: "Project added successfully", project });
  } catch (error) {
    console.log("Project Not added ", error);
    return NextResponse.json(
      { msg: "Error adding project", error: error },
      { status: 500 }
    );
  }
};

export const GET = async () => {
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
      { msg: "Error geting project", error },
      { status: 500 }
    );
  }
};

function validateInputs(
  name: string,
  userId: Types.ObjectId,
  user: unknown,
  deadline: string | undefined
) {
  if (!name) throw new Error("name required");
  if (!userId) throw new Error("userId required");
  if (!user) throw new Error("users are required");
  if (!deadline) throw new Error("deadline required");
}

import connectDB from "@/app/lib/connectDb";

import { updateProject } from "@/app/services/projectService";
import { NextResponse } from "next/server";

export const PUT = async (
  req: Request,
  { params }: { params: { id: string }; res: Response }
) => {
  try {
    await connectDB(); // Ensure database connection

    const { id } = params; // Get user ID from URL params (dynamic route)
    const { updatedData } = await req.json(); // Parse the body for updated data

    if (!id) throw new Error("Id required");
    if (!updatedData) throw new Error("updated data are required");

    const updatedProject = await updateProject(id, updatedData); // Pass parameters correctly

    if (!updatedProject) {
      throw new Error("Project not found");
    }

    return NextResponse.json(
      { msg: "Project updated successfully", updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating Project:", error);
    return NextResponse.json({ msg: "Project not updated", error });
  }
};

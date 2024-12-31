import connectDB from "@/app/lib/connectDb";
import { updateProject } from "@/app/services/projectService";
import { NextResponse } from "next/server";
import { validate } from "@/app/utils/validate";
import { messages } from "@/app/helper/messageHelper";

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB(); // Ensure database connection

    const { id } = params; // Get user ID from URL params (dynamic route)

    const body = await req.json();
    const { name, status, users, deadline, userId } = body || {};
    console.log(":::::Body :- ", body);

    // const currentProject = await getProjectById(id);
    // if (!currentProject) {
    //   throw new Error(messages.project.notFound);
    // }

    // const isOwner = currentProject.createdBy.toString() === userId;
    // if (!isOwner) {
    //   return NextResponse.json(
    //     { msg: "Only the owner of the project can update it." },
    //     { status: 403 } // Forbidden status
    //   );
    // }

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

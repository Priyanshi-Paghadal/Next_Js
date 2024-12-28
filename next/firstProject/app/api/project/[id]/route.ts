/* eslint-disable @typescript-eslint/no-explicit-any */
import connectDB from "@/app/lib/connectDb";
import { updateProject } from "@/app/services/projectService";
import { NextResponse } from "next/server";
import { validate } from "@/app/utils/validate";
import { messages } from "@/app/helper/messageHelper";

export const PUT = async (
  req: Request,
  { params }: { params: { id: string }; res: Response }
) => {
  try {
    await connectDB(); // Ensure database connection

    const { id } = params; // Get user ID from URL params (dynamic route)

    const body = await req.json();
    const { name, status, updatedBy, user, deadline, userId } = body;
    console.log(":::::Body :- ", body);

    const role =
      user.find((u: { userId: any }) => u.userId === updatedBy)?.role ||
      "unknown";

    console.log("::::: role", role);

    if (role !== "admin" && role !== "owner") {
      throw new Error(messages.project.unAuth);
    }

    const updatedData = {
      name,
      status,
      updatedBy,
      user,
      deadline,
      userId,
    };

    validate(id, updatedData);

    const updatedProject = await updateProject(id, updatedData); // Pass parameters correctly

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

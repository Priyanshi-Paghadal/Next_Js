import connectDB from "@/app/lib/connectDb";
import { updateTask } from "@/app/services/taskService";
import { NextResponse } from "next/server";
import { validate } from "@/app/utils/validate";
import { messages } from "@/app/helper/messageHelper";

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params; // Get user ID from URL params (dynamic route)
    const { updatedData } = await req.json(); // Parse the body for updated data

    validate(id, updatedData);

    await connectDB(); // Ensure database connection

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

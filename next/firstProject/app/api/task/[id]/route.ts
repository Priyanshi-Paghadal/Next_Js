import connectDB from "@/app/lib/connectDb";
import { updateTask } from "@/app/services/taskService";
import { NextResponse } from "next/server";

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {

    const { id } = params; // Get user ID from URL params (dynamic route)
    const { updatedData } = await req.json(); // Parse the body for updated data

    if (!id) throw new Error("Id required");
    if (!updatedData) throw new Error("updated data are required");

    await connectDB(); // Ensure database connection

    const updatedTask = await updateTask(id, updatedData); // Pass parameters correctly

    if (!updatedTask) {
      throw new Error("Task not found");
    }

    return NextResponse.json({msg:"Task updated successfully",updatedTask},{status:200})
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({msg:"Task not updated"},{status:500})
  }
};

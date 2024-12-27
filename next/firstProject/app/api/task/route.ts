import { NextResponse } from "next/server";
import connectDB from "@/app/lib/connectDb";
import { createTask, getTask } from "@/app/services/taskService";
import { NewTaskInterFace } from "@/app/model/taskModel";

export const POST = async (req: Request): Promise<Response> => {
  try {
    connectDB();
    const {
      projectId,
      name,
      priority,
      users,
      dueDate,
      userId,
    }: NewTaskInterFace= await req.json();

    if (!projectId) throw new Error("Name is required");
    if (!name) throw new Error("Name is required");
    if (!priority) throw new Error("priority is required");
    if (!users) throw new Error("users are required");
    if (!dueDate) throw new Error("dueDate is required");
    if (!userId) throw new Error("userId is required");

    const task = await createTask({
      projectId,
      name,
      priority,
      users,
      dueDate,
      completed: false, // Default value
      archive: false, // Default value
      userId,
    });

    return NextResponse.json({ msg: "Task added successfully", task });
  } catch (error) {
    console.log("Task not added", error);
    return NextResponse.json(
      { error: "Task not added", details: error },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    await connectDB(); // Ensure database connection
    const tasks = await getTask(); // Fetch tasks
    return NextResponse.json({
      message: "All tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    console.error("Task not found ", error);
    return NextResponse.json(
      { message: "Error retrieving tasks", error: error },
      { status: 500 }
    );
  }
};

import { NextResponse } from "next/server";
import connectDB from "@/app/lib/connectDb";
import { createTask, getTask } from "@/app/services/taskService";
import { NewTaskInterFace } from "@/app/interface/taskInterface";
import { validateTasks } from "@/app/utils/validate";
import { messages } from "@/app/helper/messageHelper";

export const POST = async (req: Request): Promise<Response> => {
  try {
    connectDB();

    const payload = await req.json();
    console.log("Payload received:", payload); // Debug log
    const {
      projectId,
      name,
      priority,
      users,
      dueDate,
      createdBy,
    }: NewTaskInterFace = payload;

    const taskDetails = {
      projectId,
      name,
      priority,
      users,
      dueDate,
      completed: false, // Default value
      archive: false, // Default value
      createdBy,
    };

    validateTasks(taskDetails);

    const task = await createTask(taskDetails);

    return NextResponse.json({ msg: messages.task.created, task });
  } catch (error) {
    console.log("Task not added", error);
    return NextResponse.json({ error: "Task not added" }, { status: 500 });
  }
};

export const GET = async () => {
  try {
    await connectDB(); // Ensure database connection
    const tasks = await getTask(); // Fetch tasks
    return NextResponse.json({
      message: messages.task.retrived,
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

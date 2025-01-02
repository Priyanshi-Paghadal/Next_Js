import { NextResponse } from "next/server";
import connectDB from "@/app/lib/connectDb";
import { createTask, getTasks } from "@/app/services/taskService";
import { TaskPayloadInterface } from "@/app/interface/taskInterface";
import { messages } from "@/app/helper/messageHelper";

export const POST = async (req: Request): Promise<Response> => {
  try {
    connectDB();

    const payload: TaskPayloadInterface = await req.json();

    const task = await createTask(payload);

    return NextResponse.json({ msg: messages.task.created, task });
  } catch (error) {
    console.log("Task not added", error);
    return NextResponse.json({ error: "Task not added" }, { status: 500 });
  }
};

export const GET = async () => {
  try {
    await connectDB(); // Ensure database connection
    const tasks = await getTasks(); // Fetch tasks
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

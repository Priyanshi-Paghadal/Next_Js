import { NextResponse } from "next/server";
import connectDB from "@/app/lib/connectDb";
import { createTask, getTask } from "@/app/services/taskService";

export const POST = async (req: Request) => {
  try {
    connectDB();
    const { prtId, name, priority, assigned, dueDate, createdBy } =
      await req.json();
    console.log(":::::Req body", {
      prtId,
      name,
      priority,
      assigned,
      dueDate,
      createdBy,
    });

    if (!name || !priority || !assigned || !dueDate || !createdBy) {
      return NextResponse.json(
        {
          error:
            "Name, priority,assigned,dueDate, and createdBy ,are required fields.",
        },
        { status: 400 }
      );
    }
    const task = await createTask({
      prtId,
      name,
      priority,
      assigned,
      dueDate,
      createdBy,
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
      { message: "Error retrieving tasks", error: error.message },
      { status: 500 }
    );
  }
};

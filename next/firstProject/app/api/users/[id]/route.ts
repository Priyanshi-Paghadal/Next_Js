import connectDB from "@/app/lib/connectDb";
import { updateUser } from "@/app/services/userService";
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

    const updatedUser = await updateUser(id, updatedData); // Pass parameters correctly

    if (!updatedUser) {
      throw new Error(messages.user.notFound);
    }

    return NextResponse.json(
      { msg: messages.user.updated, updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ msg: "User not updated" }, { status: 500 });
  }
};

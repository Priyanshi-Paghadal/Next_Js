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
    await connectDB(); // Ensure database connection
    const { id } = params; // Get user ID from URL params (dynamic route)
    const { name, email, password, mobile, gender, birthDate } =
      await req.json(); // Parse the body for updated data
    const updatedData = { name, email, password, mobile, gender, birthDate };

    validate(id, updatedData);

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
    return NextResponse.json(error, { status: 500 });
  }
};

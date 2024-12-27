import connectDB from "@/app/lib/connectDb";
import { updateUser } from "@/app/services/userService";
import { NextResponse } from "next/server";

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    // const { id, updatedData } = await req.json(); // Parse request body

    const { id } = params; // Get user ID from URL params (dynamic route)
    const { updatedData } = await req.json(); // Parse the body for updated data

    if (!id) throw new Error("Id required");
    if (!updatedData) throw new Error("updated data are required");

    await connectDB(); // Ensure database connection

    const updatedUser = await updateUser(id, updatedData); // Pass parameters correctly

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return NextResponse.json(
      { msg: "User updated succesfully",updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ msg: "User not updated" }, { status: 500 });
  }
};

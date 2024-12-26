import connectDB from "@/app/lib/connectDb";
import { updateUser} from "@/app/services/userService";

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    // const { id, updatedData } = await req.json(); // Parse request body

    const { id } = params; // Get user ID from URL params (dynamic route)
    const { updatedData } = await req.json(); // Parse the body for updated data

    if (!id || !updatedData) {
      return new Response(
        JSON.stringify({ message: "ID and updated data are required" }),
        { status: 400 }
      );
    }

    await connectDB(); // Ensure database connection

    const updatedUser = await updateUser(id, updatedData); // Pass parameters correctly

    if (!updatedUser) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "User updated successfully",
        user: updatedUser,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error", error: error }),
      { status: 500 }
    );
  }
};
import { NextResponse } from "next/server";
import connectDB from "@/app/lib/connectDb";
import { createUser, getUser } from "@/app/services/userService";

export const POST = async (req: Request) => {
  try {
    connectDB();
    const { name, email, norEmail, password, mobile, gender, birthDate, age } =
      await req.json();
    const user = await createUser({ name, email, norEmail, password, mobile, gender, birthDate, age});

    return NextResponse.json({ msg: "User added successfully", user });
  } catch (error) {
    console.log("User not added", error);
    return NextResponse.json(
      { error: "User not added", details: error },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    connectDB();
    const users = await getUser(); // Fetch all users
    return NextResponse.json({ msg: "All users", users });
  } catch (error) {
    console.log("User not found", error);
  }
};

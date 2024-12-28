import { NextResponse } from "next/server";
import connectDB from "@/app/lib/connectDb";
import { createUser, getUser } from "@/app/services/userService";
import { NewUserInterface } from "@/app/interface/userInterface";
import { validateUsers } from "@/app/utils/validate";
import { messages } from "@/app/helper/messageHelper";

export const POST = async (req: Request): Promise<Response> => {
  try {
    await connectDB();

    const {
      name,
      email,
      password,
      mobile,
      gender,
      birthDate,
    }: NewUserInterface = await req.json();

    const userDetails = {
      name,
      email,
      password,
      mobile,
      gender,
      birthDate,
    };
    validateUsers(userDetails);

    const user = await createUser(userDetails); // create user

    return NextResponse.json({ msg: messages.user.created, user });
  } catch (error) {
    console.log(messages.user.notAdded, error);
    return NextResponse.json({ msg: messages.user.notAdded, error });
  }
};

export const GET = async () => {
  try {
    connectDB();
    const users = await getUser(); // Fetch all users
    return NextResponse.json({ msg: "All users", users });
  } catch (error) {
    console.log(messages.user.notFound, error);
    return NextResponse.json({ msg: messages.user.notFound, error });
  }
};
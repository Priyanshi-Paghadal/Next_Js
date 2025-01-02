import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/connectDb";
import { createUser, getUsers } from "@/app/services/userService";
import { messages } from "@/app/helper/messageHelper";
import path from "path";
import fs from "fs";
import { UserPayLoadInterface } from "@/app/interface/userInterface";
import {  validateUsers } from "@/app/utils/validate";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest): Promise<NextResponse | unknown> {
  try {
    // Connect to the database
    await connectDB();

    // First, extract the formData (for handling both JSON fields and file uploads)
    const formData = await req.formData();

    // Extract the user image from formData
    const profilePic = formData.get("profilePic") as File;
    console.log("profilePic ::: ", profilePic);

    if (!profilePic) {
      throw Error("No image file uploaded");
    }

    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      profilePic.name
    );
    const fileBuffer = Buffer.from(await profilePic.arrayBuffer());
    fs.writeFileSync(filePath, fileBuffer);

    // Extract other fields from formData (the JSON-like data)
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const mobile = formData.get("mobile") as string;
    const gender = formData.get("gender") as string;
    const birthDate = formData.get("birthDate");

    const data = {name, email, password, mobile, gender, birthDate ,profilePic}

    validateUsers(data);

    // Prepare the data object including the profilePic path if provided
    const userData: UserPayLoadInterface = {
      name,
      email,
      password,
      mobile: mobile as unknown as number,
      gender: gender as string, // Now gender is correctly typed as 1 | 2 | 3
      birthDate,
      profilePic: `@/public/uploads/${profilePic.name}`, // Include image path if image is provided
    };

    console.log("UserData :::: ", userData);
    // console.log("profilePic ::", profilePic.name);

    // Call the addUser service to add the user to the database
    const newUser = await createUser(
      userData,
      profilePic as unknown as Express.Multer.File
    );
    // const newUser = await addUser(userData);

    console.log("newUser ::", newUser);

    // Return the response after successfully adding the user
    return NextResponse.json(
      { message: "Data added successfully!", user: userData },
      { status: 201 }
    );
  } catch (error) {
    console.error("user not added",error);
    throw Error("user not added");
  }
}

export const GET = async () => {
  try {
    connectDB();
    const users = await getUsers(); // Fetch all users
    return NextResponse.json({ msg: "All users", users });
  } catch (error) {
    console.log(messages.user.notFound, error);
    return NextResponse.json({ msg: messages.user.notFound, error });
  }
};

import { NextResponse } from "next/server";
import connectDB from "@/app/lib/connectDb";
import { createUser, getUser } from "@/app/services/userService";
import { NewUserInterface } from "@/app/model/userModel";

export const POST = async (req: Request): Promise<Response> => {
  try {
    await connectDB();

    const {
      name,
      email,
      norEmail,
      password,
      mobile,
      gender,
      birthDate,
      age,
    }: NewUserInterface = await req.json();

    validateInputs(name, email, norEmail, password, mobile, gender, birthDate);

    const user = await createUser({
      name,
      email,
      norEmail,
      password,
      mobile,
      gender,
      birthDate,
      age,
    }); // create user

    return NextResponse.json({ msg: "User added successfully", user });
  } catch (error) {
    console.log("User not added", error);
    return NextResponse.json({ msg: "User not added", error });
  }
};

export const GET = async () => {
  try {
    connectDB();
    const users = await getUser(); // Fetch all users
    return NextResponse.json({ msg: "All users", users });
  } catch (error) {
    console.log("User not found", error);
    return NextResponse.json({ msg: "User not found", error });
  }
};

function validateInputs(
  name: string,
  email: string,
  norEmail: string,
  password: string,
  mobile: number,
  gender:  string,
  birthDate: Date
) {
  if (!name) throw new Error("Name is required"); // validate all required fileds are filled
  if (!email) throw new Error("Email is required"); // validate all required fileds are filled
  if (!norEmail) throw new Error("norEmail is required"); // validate all required fileds are filled
  if (!password) throw new Error("Password is required"); // validate all required fileds are filled
  if (!mobile) throw new Error("Mobile is required"); // validate all required fileds are filled
  if (!gender) throw new Error("Gender is required"); // validate all required fileds are filled
  if (!birthDate) throw new Error("Birthdate is required"); // validate all required fileds are filled
}

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/connectDb";
import { createUser, getUsers } from "@/app/services/userService";
import { messages } from "@/app/helper/messageHelper";
// import { UserPayLoadInterface } from "@/app/interface/userInterface";
// import formidable from "formidable";
import path from "path";
import fs from "fs";
import { UserPayLoadInterface } from "@/app/interface/userInterface";
// import { IncomingMessage } from "http";
// import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

// export const POST = async (req: Request): Promise<Response> => {
//   try {
//     await connectDB();

//     const incomingReq = req as unknown as IncomingMessage;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
//     const readableStream = Readable.from(incomingReq as any);

//     const form = formidable({
//       uploadDir: path.join(process.cwd(), '/public/uploads'), // where to save files
//       keepExtensions: true, // preserve file extensions
//     });

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const parsedData = await new Promise<any>((resolve, reject) => {
//       form.parse(incomingReq, (err, fields, files) => {
//         if (err) reject(err);
//         resolve({ fields, files });
//       });
//     });

//     const { fields }: { fields: UserPayLoadInterface } = parsedData;

//     const userDetails = {
//       name: fields.name,
//       email: fields.email,
//       password: fields.password,
//       mobile: fields.mobile,
//       gender: fields.gender,
//       birthDate: fields.birthDate,
//     };

//     const user = await createUser(userDetails);

//     // const {
//     //   name,
//     //   email,
//     //   password,
//     //   mobile,
//     //   gender,
//     //   birthDate,
//     // }: UserPayLoadInterface = await req.json();

//     // const userDetails = {
//     //   name,
//     //   email,
//     //   password,
//     //   mobile,
//     //   gender,
//     //   birthDate,
//     // };

//     // const user = await createUser(userDetails); // create user

//     return NextResponse.json({ msg: messages.user.created, user });
//   } catch (error) {
//     console.log(messages.user.notAdded, error);
//     return NextResponse.json({ msg: messages.user.notAdded, error });
//   }
// };

export async function POST(req: NextRequest): Promise<NextResponse | unknown> {
  try {
    // Connect to the database
    await connectDB();

    // First, extract the formData (for handling both JSON fields and file uploads)
    const formData = await req.formData();

    // Extract the user image from formData
    const userImage = formData.get("userImage") as File;
    console.log("userImage ::: ", userImage);

    if (!userImage) {
      throw Error("No image file uploaded");
    }

    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      userImage.name
    );
    const fileBuffer = Buffer.from(await userImage.arrayBuffer());
    fs.writeFileSync(filePath, fileBuffer);

    // Extract other fields from formData (the JSON-like data)
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const mobile = formData.get("mobile") as string;
    const gender = formData.get("gender") as string;
    const birthDate = formData.get("birthDate") as string;
    const role = formData.get("role") as string;

    // Ensure required fields are present
    if (
      !name ||
      !email ||
      !password ||
      !mobile ||
      !gender ||
      !birthDate ||
      !role
    ) {
      throw Error("Missing required fields");
    }

    // Validate gender (ensure it's one of 1, 2, or 3)
    const genderValue = parseInt(gender);
    if (![1, 2, 3].includes(genderValue)) {
      throw Error("Invalid gender value");
    }

    // Prepare the data object including the userImage path if provided
    const userData: UserPayLoadInterface = {
      name,
      email,
      password,
      mobile : mobile as unknown as number,
      gender: gender as string , // Now gender is correctly typed as 1 | 2 | 3
      birthDate,
      // profilePic: `@/public/uploads/${userImage.name}`, // Include image path if image is provided
    };

    console.log("UserData :::: ", userData);
    console.log("userImage ::", userImage.name);

    // Call the addUser service to add the user to the database
    const newUser = await createUser(
      userData,
      userImage as unknown as Express.Multer.File
    );
    // const newUser = await addUser(userData);

    console.log("newUser ::", newUser);

    // Return the response after successfully adding the user
    return NextResponse.json(
      { message: "Data added successfully!", user: userData },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error adding user:", error.message);
      throw Error(error.message || "Error adding user");
      // return NextResponse.json({ message: error.message || "Error adding user" }, { status: 500 });
    } else {
      console.error("An unknown error occurred");
      throw Error("Unknown error");
      // return NextResponse.json({ message: "Unknown error" }, { status: 500 });
    }
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

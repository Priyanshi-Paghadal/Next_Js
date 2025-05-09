export interface NewUserInterface extends Document {
  isModified(arg: string): unknown;
  name: string;
  email: string;
  norEmail: string;
  password: string;
  mobile: number; // Optional mobile number
  gender: "Male" | "Female" | "Other"; // Enum type for gender
  birthDate: Date; // Optional birthdate
  age: number; // Optional age
  profilePic: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface UserPayLoadInterface {
  name: string;
  email: string;
  password: string;
  mobile: number;
  gender: string;
  profilePic: string;
  birthDate: Date;
}

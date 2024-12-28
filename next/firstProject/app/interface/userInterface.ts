export interface NewUserInterface extends Document {
  name: string;
  email: string;
  norEmail: string;
  password: string;
  mobile: number; // Optional mobile number
  gender: "Male" | "Female" | "Other"; // Enum type for gender
  birthDate: Date; // Optional birthdate
  age: number; // Optional age
  createdAt: Date;
  updatedAt: Date;
}

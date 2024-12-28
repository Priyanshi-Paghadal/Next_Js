import { ProjectPayloadInterface } from "../interface/projectInterface";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validate(id: string, updatedData: any) {
  if (!id) throw new Error("Id required");
  if (!updatedData) throw new Error("updated data are required");
}

export function validateUsers(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
) {
  const { name, email, password, mobile, gender, birthDate } = payload;

  if (!name) throw new Error("Name is required");
  if (!email) throw new Error("Email is required");
  if (!password) throw new Error("Password is required");
  if (!mobile) throw new Error("Mobile is required");
  if (!gender) throw new Error("Gender is required");
  if (!birthDate) throw new Error("Birthdate is required");
}

export async function validateProjects(payload: ProjectPayloadInterface) {
  try {
    const { name, userId, users, deadline } = payload;
    if (!name) throw new Error("name required");
    if (!userId) throw new Error("createdBy required");
    if (users.length === 0 && !users) throw new Error("users are required");
    if (!deadline) throw new Error("deadline required");
  } catch (error) {
    throw error;
  }
}

export function validateTasks(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
) {
  const { projectId, name, priority, users, dueDate, userId } = payload;
  if (!projectId) throw new Error("Project id is required");
  if (!name) throw new Error("Name is required");
  if (!priority) throw new Error("priority is required");
  if (!users) throw new Error("users are required");
  if (!dueDate) throw new Error("dueDate is required");
  if (!userId) throw new Error("userId is required");
}

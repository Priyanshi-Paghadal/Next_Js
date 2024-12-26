import Project from "../model/projectModel";
import { NewProjectInterface } from "../model/projectModel";

export const createProject = async (
  projectData: NewProjectInterface
): Promise<NewProjectInterface | null> => {
  try {
    // Create a new task using the Task model
    const newProject = await Project.create(projectData);
    console.log(newProject);
    return newProject;
  } catch (error) {
    throw new Error(`Error creating task: ${error}`);
  }
};

export const getProject = async () => {
  try {
    const project = await Project.find();
    return project;
  } catch (error) {
    throw new Error(`Error getting task: ${error}`);
  }
};

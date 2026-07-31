import projectModel from "../models/project.model.js";
import mongoose from "mongoose";

export const createProject = async ({
    name, userId 
}) =>{

    if(!name || !userId){
        throw new Error("Project name and userId are required");
    }

    const project = await projectModel.create({
        name,
        users: [userId]
    });

    return project;
}

export const getAllProjectsByUserId = async (userId) => {
    if(!userId){
        throw new Error("UserId is required");
    }

    const allUserProjects = await projectModel.find({ 
        users: userId
    });

    return allUserProjects;
}

export const addUsersToProject = async ({projectId, users, userId}) => {
    if(!projectId){
        throw new Error("ProjectId is required");
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Invalid projectId");
    }

    if(!users){
        throw new Error("Users are required");
    }

    if(!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error("Invalid user IDs");
    }

    if(!userId){
        throw new Error("UserId is required");
    }

    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new Error("Invalid userId");
    }

    const project = await projectModel.findOne({
        _id: projectId,
        users: userId
    })

    console.log(project);

    if(!project){
        throw new Error("Project not found or user is not authorized to add users");
    }

    const updatedProject = await projectModel.findOneAndUpdate({ 
        _id: projectId 
        },{ 
            $addToSet: { 
                users: { 
                    $each: users 
                } 
            } 
        },{ 
            new: true
        });

    return updatedProject;

}

export const getProjectById = async ({ projectId }) => {
    if(!projectId){
        throw new Error("ProjectId is required");
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Invalid projectId");
    }

    const project = await projectModel.findOne({
        _id: projectId
    }).populate('users');

    return project;
}
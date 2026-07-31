import {Router} from "express";
import * as projectController from "../controllers/project.controller.js";
import { body } from "express-validator";
import * as authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create", 
    authMiddleware.authUser,
    body("name").isString().withMessage("Project name is required"),
    projectController.createProject
);

router.get("/all",
    authMiddleware.authUser,
    projectController.getAllProjects
);

router.put("/add-user",
    authMiddleware.authUser,
    body("projectId").isString().withMessage("ProjectId is required"),
    body("users").isArray({ min: 1 }).withMessage("user must be an array of strings with at least one user").bail()
        .custom((users) => users.every(user => typeof user === "string")).withMessage("Each user must be a string"),

    projectController.addUserToProject
);

router.get("/get-project/:projectId",
    authMiddleware.authUser,
    projectController.getProjectById
);

export default router;
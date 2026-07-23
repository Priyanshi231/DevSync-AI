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

export default router;
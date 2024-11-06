import express from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";

const router = express();

const userRepositery = AppDataSource.getRepository(User);

const userService = new UserService(userRepositery);

const authController = new AuthController(userService, logger);

router.post("/register", (req, res, next) =>
    authController.register(req, res, next),
);

export default router;

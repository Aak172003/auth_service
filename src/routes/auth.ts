import express from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";

const router = express();

const userRepositery = AppDataSource.getRepository(User);

const userService = new UserService(userRepositery);

const authController = new AuthController(userService);

router.post("/register", (req, res) => authController.register(req, res));

export default router;

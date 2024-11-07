import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import registerValidator from "../validators/register-validator";

const router = express();

const userRepositery = AppDataSource.getRepository(User);

const userService = new UserService(userRepositery);

const authController = new AuthController(userService, logger);

router.post(
    "/register",
    // body("email").notEmpty(),
    // [body("email").notEmpty(), body("firstName").notEmpty()],

    registerValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        await authController.register(req, res, next);
    },
);

export default router;

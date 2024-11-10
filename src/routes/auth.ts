import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import registerValidator from "../validators/register-validator";
import { TokenService } from "../services/TokenService";
import { RefreshToken } from "../entity/RefreshToken";
import loginValidator from "../validators/login-validator";
import { CredentialService } from "../services/CredentialService";

const router = express();
const credentialService = new CredentialService();
const userRepository = AppDataSource.getRepository(User);
const tokenRepositery = AppDataSource.getRepository(RefreshToken);

const userService = new UserService(userRepository, credentialService);
const tokenService = new TokenService(tokenRepositery);

// Dependency injection
const authController = new AuthController(
    userService,
    logger,
    tokenService,
    credentialService,
);

router.post(
    "/register",
    // body("email").notEmpty(),
    // [body("email").notEmpty(), body("firstName").notEmpty()],

    registerValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        await authController.register(req, res, next);
    },
);

router.post(
    "/login",

    loginValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        await authController.login(req, res, next);
    },
);

export default router;

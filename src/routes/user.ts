import express, { NextFunction, RequestHandler, Response } from "express";

import logger from "../config/logger";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../constants";
import { CreateUserRequest } from "../types";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { CredentialService } from "../services/CredentialService";

const router = express();

const userRepository = AppDataSource.getRepository(User);
const credentialService = new CredentialService();

const userService = new UserService(userRepository, credentialService);
const userController = new UserController(logger, userService);

router.post(
    "/",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req: CreateUserRequest, res: Response, next: NextFunction) =>
        userController.create(req, res, next),
);

export default router;

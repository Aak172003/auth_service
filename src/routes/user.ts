import express, { NextFunction, RequestHandler, Response } from "express";

import logger from "../set-up/logger";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../constants";
import { CreateUserRequest, UpdateUserRequest } from "../types";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../set-up/data-source";
import { User } from "../entity/User";
import { CredentialService } from "../services/CredentialService";
import createUserValidator from "../validators/create-user-validator";
import updateUserValidator from "../validators/update-user-validator";

const router = express();

const userRepository = AppDataSource.getRepository(User);
const credentialService = new CredentialService();
const userService = new UserService(userRepository, credentialService);
const userController = new UserController(logger, userService);

router.post(
    "/",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    createUserValidator,
    async (req: CreateUserRequest, res: Response, next: NextFunction) => {
        await userController.create(req, res, next);
    },
);

router.patch(
    "/:userId",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    updateUserValidator,
    async (req: UpdateUserRequest, res: Response, next: NextFunction) => {
        await userController.update(req, res, next);
    },
);

router.get("/", (req, res, next) => userController.getAll(req, res, next));

router.get(
    "/:userId",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req, res, next) => userController.getOne(req, res, next),
);

router.delete(
    "/:userId",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req, res, next) => userController.destroy(req, res, next),
);

export default router;

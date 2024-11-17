import { NextFunction, Request, Response } from "express";
import { Logger } from "winston";
import { UserService } from "../services/UserService";
import { CreateUserRequest, UpdateUserRequest } from "../types";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

export class UserController {
    constructor(
        private logger: Logger,
        private userService: UserService,
    ) {}
    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        // Validation
        const result = validationResult(req);

        console.log(
            "this is result from create user ============ ",
            result.array(),
        );

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstName, lastName, email, password, role, tenantId } =
            req.body;
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role,
                tenantId,
            });

            console.log("this is user from laptop ------------ ", user);
            res.status(201).json({ id: user.id });
        } catch (error) {
            console.log("error ---------------- ", error);
            next(error);
        }
    }

    async update(req: UpdateUserRequest, res: Response, next: NextFunction) {
        // In our project: We are not allowing user to change the email id since it is used as username
        // In our project: We are not allowing admin user to change others password

        // Validation
        const result = validationResult(req);

        console.log(
            "this is result from create user ============ ",
            result.array(),
        );

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstName, lastName, role } = req.body;
        const userId = req.params.userId;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, "Invalid url param."));
            return;
        }

        this.logger.debug("Request for updating a user", req.body);

        try {
            const updateUser = await this.userService.update(Number(userId), {
                firstName,
                lastName,
                role,
            });

            this.logger.info(
                "User has been updated",
                { id: userId },
                "of user :",
                { updateUser },
            );

            res.json({ id: Number(userId) });
        } catch (err) {
            next(err);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.getAll();

            console.log("users from user controller --------------- ", users);
            this.logger.info("All tenant have been fetched");
            res.json(users);
        } catch (err) {
            next(err);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.userId;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, "Invalid url param."));
            return;
        }

        this.logger.debug("Request for getting single user", req.body);

        try {
            const user = await this.userService.findById(Number(userId));

            if (!user) {
                next(createHttpError(400, "User does not exist."));
                return;
            }

            this.logger.info("User has been fetched", { id: user.id });
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.userId;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, "Invalid url param."));
            return;
        }

        this.logger.debug("Request for getting single user", req.body);

        try {
            const deletedUser = await this.userService.deleteById(
                Number(userId),
            );

            this.logger.info("Tenant has been deleted", {
                id: Number(userId),
                user: deletedUser,
            });
            res.json({ id: Number(userId) });
        } catch (error) {
            next(error);
        }
    }
}

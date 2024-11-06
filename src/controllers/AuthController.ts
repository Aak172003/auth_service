import { NextFunction, Response } from "express";

import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { ResponseMessage } from "../config/responseMessage";

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}
    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        const { firstName, lastName, email, password } = req.body;

        // This is logger
        this.logger.debug("New request to register a user ", {
            firstName,
            lastName,
            email,
            password: password,
        });
        try {
            const createdUser = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            });

            this.logger.info(ResponseMessage.USER_REGISTERED_SUCCESSFULLY, {
                id: createdUser.id,
                user: createdUser,
            });
            console.log("createdUser ---------- ", createdUser);
            res.status(201).json({ id: createdUser.id });
        } catch (error) {
            console.log(error);
            next(error);
            return;
        }
    }
}

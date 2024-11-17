import { NextFunction, Response } from "express";
import { Logger } from "winston";
import { UserService } from "../services/UserService";
import { CreateUserRequest } from "../types";
import { Roles } from "../constants";

export class UserController {
    constructor(
        private logger: Logger,
        private userService: UserService,
    ) {}
    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        const { firstName, lastName, email, password } = req.body;
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role: Roles.MANAGER,
            });

            console.log("this is user from laptop ------------ ", user);
            res.status(201).json({ id: user.id });
        } catch (error) {
            console.log("error ---------------- ", error);
            next(error);
        }
    }
}

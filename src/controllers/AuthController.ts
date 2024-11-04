import { Response } from "express";

import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";

export class AuthController {
    constructor(private userService: UserService) {}
    async register(req: RegisterUserRequest, res: Response) {
        const { firstName, lastName, email, password } = req.body;

        try {
            const createdUser = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            });

            console.log("createdUser ---------- ", createdUser);
            res.status(201).json({
                ok: "ok done",
                message: "Ok done message ",
                createdUser,
            });
        } catch (error) {
            console.log(error);
        }
    }
}

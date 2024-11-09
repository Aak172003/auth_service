import { NextFunction, Response, Request } from "express";

import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { ResponseMessage } from "../config/responseMessage";
import { validationResult } from "express-validator";
import { JwtPayload, sign } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import createHttpError from "http-errors";
import { Config } from "../config";
import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/RefreshToken";

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
        // if (!email) {
        //     const error = createHttpError(400, "email is required");
        //     next(error);
        //     return;
        // }

        // Validation
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

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

            let privateKey: Buffer;

            try {
                // __dirname means pointing to current folder
                privateKey = fs.readFileSync(
                    path.join(__dirname, "../../certs/private.pem"),
                );
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                const error = createHttpError(
                    500,
                    "Error while reading private Key",
                );
                next(error);
                return;
            }
            const payLoad: JwtPayload = {
                // sub me jiske lie token generate ho rha hai
                sub: String(createdUser.id),
                role: createdUser.role,
            };
            const accessToken = sign(payLoad, privateKey, {
                algorithm: "RS256",
                expiresIn: "1h",
                // which service sign this token
                issuer: "auth-service",
            });

            // Persist the refresh token in the database correspoint to user

            const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // Leap Year
            const refreshTokenRepository =
                AppDataSource.getRepository(RefreshToken);

            const newRefreshToken = await refreshTokenRepository.save({
                // here we send whole user data , internally typeorm create userId field and assign createduser id to it
                user: createdUser,
                expiresAt: new Date(Date.now() + MS_IN_YEAR),
            });

            const refreshToken = sign(payLoad, Config.REFRESH_SECRET_KEY!, {
                algorithm: "HS256",
                expiresIn: "1y",
                issuer: "auth-service",
                jwtid: String(newRefreshToken.id),
            });
            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict", // security
                maxAge: 1000 * 60 * 60, // 1 hour
                // httpOnly means , this can't access by client side , and only my server can access
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict", // security
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 Year
                // httpOnly means , this can't access by client side , and only my server can access
                httpOnly: true,
            });

            res.status(201).json({ id: createdUser.id });
        } catch (error) {
            console.log(error);
            next(error);
            return;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    login(req: Request, res: Response, next: NextFunction) {
        res.status(200).json({});
    }
}

import { NextFunction, Response } from "express";

import { AuthRequest, LoginUserRequest, RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { ResponseMessage } from "../config/responseMessage";
import { validationResult } from "express-validator";
import { JwtPayload } from "jsonwebtoken";
import { TokenService } from "../services/TokenService";
import createHttpError from "http-errors";
import { CredentialService } from "../services/CredentialService";

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credentialService: CredentialService,
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

            const payLoad: JwtPayload = {
                // sub me jiske lie token generate ho rha hai
                sub: String(createdUser.id),
                role: createdUser.role,
            };

            const accessToken = this.tokenService.generateToken(payLoad);

            // Persist the refresh token in the database correspoint to user

            // const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // Leap Year
            // const refreshTokenRepository =
            //     AppDataSource.getRepository(RefreshToken);

            const newRefreshToken =
                await this.tokenService.persistRefreshToken(createdUser);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payLoad,
                id: String(newRefreshToken.id),
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

    async login(req: LoginUserRequest, res: Response, next: NextFunction) {
        // Validation
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const { email, password } = req.body;

        // This is logger
        this.logger.debug("New request to login a user ", {
            email,
            password: password,
        });

        // check if provided email is exist in our db or not
        // if exist , then compare given password with password is stored in db correcponding to that email id
        // Generate Token
        // Add tokens into cookies
        // return the response (id)

        try {
            const user = await this.userService.findByEmail(email);
            if (!user) {
                const error = createHttpError(
                    404,
                    "Email does not match of user",
                );
                next(error);
                return;
            }

            const passwordMatch = await this.credentialService.comparePassword(
                password,
                user.password,
            );

            if (!passwordMatch) {
                const error = createHttpError(400, "password does not match");
                next(error);
                return;
            }

            this.logger.info("User logged in successfully", {
                id: user.id,
            });

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.generateToken(payload);
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
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

            res.status(200).json({ id: user.id, user: user });
        } catch (error) {
            next(error);
            return;
        }
    }

    async self(req: AuthRequest, res: Response) {
        const user = await this.userService.findById(Number(req.auth.sub));

        // undefined means i remove the password from ...user data
        res.json({ ...user, password: undefined });
    }
}

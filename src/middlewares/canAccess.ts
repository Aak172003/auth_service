import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../types";
import createHttpError from "http-errors";

export const canAccess = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log("roles =================== ", roles);

        const new_req = req as AuthRequest;

        const roleFromToken = new_req.auth.role;

        if (!roles.includes(roleFromToken)) {
            const error = createHttpError(
                403,
                "you don't have enoough permissions",
            );

            next(error);
            return;
        }

        // call next here , because this is a middleware
        next();
    };
};

import { expressjwt, GetVerificationKey } from "express-jwt";
import jwksClient from "jwks-rsa";
import { Config } from "../set-up";
import { Request } from "express";
import { AuthCookie } from "../types";

export default expressjwt({
    secret: jwksClient.expressJwtSecret({
        jwksUri: Config.JWKS_URI!,
        cache: true,
        rateLimit: true,
    }) as GetVerificationKey,

    algorithms: ["RS256"],

    // here i overwrite the gettoken functionality
    getToken(req: Request) {
        // first check form header where i send the bearer token in authorization key
        const authHeader = req.headers.authorization;

        // bearer token -> split into two parts from " " -> [bearer][token]
        if (authHeader && authHeader.split(" ")[1] !== "undefined") {
            const token = authHeader.split(" ")[1];
            if (token) {
                return token;
            }
        }

        // 2nd way to get token form cookie
        const { accessToken } = req.cookies as AuthCookie;
        return accessToken;
    },
});

import { Request } from "express";
import { expressjwt } from "express-jwt";
import { Config } from "../config";
import { AuthCookie } from "../types";

export default expressjwt({
    secret: Config.REFRESH_SECRET_KEY!,
    algorithms: ["HS256"],
    // First we need to get token from cookie , because refreshToken only stored at cookies
    getToken(req: Request) {
        const { refreshToken } = req.cookies as AuthCookie;
        return refreshToken;
    },
});

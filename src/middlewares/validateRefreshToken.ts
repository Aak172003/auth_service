import { expressjwt } from "express-jwt";
import { Config } from "../config";
import { Request } from "express";
import { AuthCookie, RefreshTokenPayload } from "../types";
import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/RefreshToken";
import logger from "../config/logger";

export default expressjwt({
    secret: Config.REFRESH_SECRET_KEY!,
    algorithms: ["HS256"],
    getToken(req: Request) {
        console.log("1111111111111111111111111111111");
        const { refreshToken } = req.cookies as AuthCookie;

        console.log(
            "this is refreshToken ----- from validateRefreshToken --- ",
            refreshToken,
        );

        return refreshToken;
    },

    // when user want logout so this will revoke or delete the refreshToken form database
    // here we check is refreshToken exist in database or not , if not means user already revoked or logout

    async isRevoked(request: Request, token) {
        try {
            const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);

            const refreshToken = await refreshTokenRepo.find({
                where: {
                    id: Number((token?.payload as RefreshTokenPayload).id),
                    user: { id: Number(token?.payload?.sub) },
                },
            });
            return refreshToken === null;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            logger.error("Error while getting the refreshToken", {
                id: Number((token?.payload as RefreshTokenPayload).id),
            });
        }

        return true;
    },
});

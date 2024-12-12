import createHttpError from "http-errors";
import { JwtPayload, sign } from "jsonwebtoken";
import { Config } from "../set-up";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import { Repository } from "typeorm";

export class TokenService {
    constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

    // generateAccessToken(payLoad: JwtPayload) {
    //     let privateKey: Buffer;
    //     // let privateKey: string;

    //     if (!Config.PRIVATE_KEY) {
    //         const error = createHttpError(500, "SECRET Key is not set");
    //         throw error;
    //     }
    //     try {
    //         // __dirname means pointing to current folder
    //         // privateKey = fs.readFileSync(
    //         //     path.join(__dirname, "../../certs/private.pem"),
    //         // );

    //         privateKey = Config.PRIVATE_KEY;
    //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     } catch (err) {
    //         const error = createHttpError(
    //             500,
    //             "Error while reading private Key",
    //         );
    //         throw error;
    //     }
    //     const accessToken = sign(payLoad, privateKey, {
    //         algorithm: "RS256",
    //         expiresIn: "1h",
    //         // which service sign this token
    //         issuer: "auth-service",
    //     });

    //     return accessToken;
    // }

    generateAccessToken(payLoad: JwtPayload) {
        let privateKey: string;

        if (!Config.PRIVATE_KEY) {
            const error = createHttpError(500, "SECRET Key is not set");
            throw error;
        }

        try {
            // Ensure the private key is correctly formatted
            privateKey = Config.PRIVATE_KEY.replace(/\\n/g, "\n");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            const error = createHttpError(
                500,
                "Error while processing private Key",
            );
            throw error;
        }

        const accessToken = sign(payLoad, privateKey, {
            algorithm: "RS256",
            expiresIn: "1h",
            issuer: "auth-service", // which service signs this token
        });

        return accessToken;
    }
    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, Config.REFRESH_SECRET_KEY!, {
            algorithm: "HS256",
            expiresIn: "1y",
            issuer: "auth-service",
            jwtid: String(payload.id),
        });

        return refreshToken;
    }

    async persistRefreshToken(createdUser: User) {
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // Leap Year

        const newRefreshToken = await this.refreshTokenRepository.save({
            // here we send whole user data , internally typeorm create userId field and assign createduser id to it
            user: createdUser,
            expiresAt: new Date(Date.now() + MS_IN_YEAR),
        });

        return newRefreshToken;
    }

    async deleteRefreshToken(tokenId: number) {
        const deletedRefreshToken = await this.refreshTokenRepository.delete({
            id: tokenId,
        });
        return deletedRefreshToken;
    }
}

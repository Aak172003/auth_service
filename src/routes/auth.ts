import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import registerValidator from "../validators/register-validator";
import { TokenService } from "../services/TokenService";
import { RefreshToken } from "../entity/RefreshToken";
import loginValidator from "../validators/login-validator";
import { CredentialService } from "../services/CredentialService";
import authenticate from "../middlewares/authenticate";
import { AuthRequest } from "../types";
import validateRefreshToken from "../middlewares/validateRefreshToken";
import parseRefreshToken from "../middlewares/parseRefreshToken";

const router = express();
const credentialService = new CredentialService();
const userRepository = AppDataSource.getRepository(User);
const tokenRepositery = AppDataSource.getRepository(RefreshToken);

const userService = new UserService(userRepository, credentialService);
const tokenService = new TokenService(tokenRepositery);

// Dependency injection
const authController = new AuthController(
    userService,
    logger,
    tokenService,
    credentialService,
);

router.post(
    "/register",
    // body("email").notEmpty(),
    // [body("email").notEmpty(), body("firstName").notEmpty()],

    registerValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        await authController.register(req, res, next);
    },
);

router.post(
    "/login",

    loginValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        await authController.login(req, res, next);
    },
);

router.get(
    "/self",
    authenticate as RequestHandler,
    (req: Request, res: Response) =>
        authController.self(req as AuthRequest, res),
);

// Why post is more secure than get

router.post(
    "/refresh",
    validateRefreshToken as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
        authController.refreshToken(req as AuthRequest, res, next),
);

router.post(
    "/logout",
    // only logged in user can logout
    authenticate as RequestHandler,
    // only loggedin user can authenticate
    parseRefreshToken as RequestHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        await authController.logout(req as AuthRequest, res, next);
    },
);

export default router;

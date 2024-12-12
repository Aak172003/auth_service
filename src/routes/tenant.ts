import express, { NextFunction, RequestHandler, Response } from "express";
import { TenantController } from "../controllers/TenantController";
import { TenantService } from "../services/TenantService";
import { AppDataSource } from "../set-up/data-source";
import { Tenant } from "../entity/tenant";
import logger from "../set-up/logger";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../constants";
import tenantValidator from "../validators/tenant-validator";
import { CreateTenantRequest } from "../types";

const router = express();

const tenantRepository = AppDataSource.getRepository(Tenant);

const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

router.post(
    "/",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    async (req: CreateTenantRequest, res: Response, next: NextFunction) => {
        await tenantController.create(req, res, next);
    },
);

router.patch(
    "/:tenantId",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    async (req: CreateTenantRequest, res: Response, next: NextFunction) => {
        await tenantController.update(req, res, next);
    },
);

router.get("/", (req, res, next) => tenantController.getAll(req, res, next));

router.get(
    "/:tenantId",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req, res, next) => tenantController.getOne(req, res, next),
);

router.delete(
    "/:tenantId",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req, res, next) => tenantController.destroy(req, res, next),
);

export default router;

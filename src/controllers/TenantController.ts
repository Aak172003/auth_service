import { NextFunction, Response, Request } from "express";
import { TenantService } from "../services/TenantService";
import { CreateTenantRequest } from "../types";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}

    async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
        // Validation
        const result = validationResult(req);

        console.log(
            "this is result from create tenant ============ ",
            result.array(),
        );

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { name, address } = req.body;

        this.logger.debug("New request to register a user ", {
            name,
            address,
        });
        try {
            const tenant = await this.tenantService.create({ name, address });
            this.logger.info("tenant has been created : ", { id: tenant.id });
            this.logger.info("created tenants : ", { tenant: tenant });
            res.status(201).json({ id: tenant.id });
        } catch (error) {
            next(error);
            return;
        }
    }

    async update(req: CreateTenantRequest, res: Response, next: NextFunction) {
        // Validation
        const result = validationResult(req);

        console.log(
            "this is result from create tenant ============ ",
            result.array(),
        );

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { name, address } = req.body;
        const tenantId = req.params.tenantId;

        if (isNaN(Number(tenantId))) {
            console.log("if not a number");
            const error = createHttpError(400, "Invalid url param");
            next(error);
            return;
        }

        this.logger.debug("Request for updating a tenant", req.body);

        try {
            // Wnt to see the updateTenant Data
            const updateTenant = await this.tenantService.update(
                Number(tenantId),
                {
                    name,
                    address,
                },
            );
            this.logger.info("Tenant has been updated", { id: tenantId });
            this.logger.info("update the tennat details : ", updateTenant);

            res.json({ id: Number(tenantId) });
        } catch (err) {
            next(err);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const tenants = await this.tenantService.getAll();
            this.logger.info("All tenant have been fetched");
            res.json(tenants);
        } catch (err) {
            next(err);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.params.tenantId;
        console.log("tenant id for fetch single tenant : ", tenantId);

        if (isNaN(Number(tenantId))) {
            const error = createHttpError(400, "Invalid url param");
            next(error);
            return;
        }

        try {
            const tenant = await this.tenantService.getById(Number(tenantId));

            if (!tenant) {
                next(createHttpError(400, "Tenant does not exist."));
                return;
            }

            this.logger.info("Tenant has been fetched");
            res.json(tenant);
        } catch (error) {
            next(error);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.params.tenantId;
        console.log("tenant id for fetch delete : ", tenantId);

        if (isNaN(Number(tenantId))) {
            const error = createHttpError(400, "Invalid url param");
            next(error);
            return;
        }

        try {
            const deletedUser = await this.tenantService.deleteById(
                Number(tenantId),
            );

            this.logger.info("Tenant has been deleted", {
                id: Number(tenantId),
                user: deletedUser,
            });
            res.json({ id: Number(tenantId) });
        } catch (error) {
            next(error);
        }
    }
}

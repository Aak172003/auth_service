import { NextFunction, Response } from "express";
import { TenantService } from "../services/TenantService";
import { CreateTenantRequest } from "../types";
import { Logger } from "winston";

export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}

    async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
        const { name, address } = req.body;

        this.logger.debug("New request to register a user ", {
            name,
            address,
        });
        try {
            const tenant = await this.tenantService.create({ name, address });

            this.logger.info("tenant has been created : ", { id: tenant.id });
            this.logger.info("created tenants : ", { tenant: tenant });

            console.log(
                "this is tenant created inside controller -------------------- ",
                tenant,
            );
            res.status(201).json({ id: tenant.id });
        } catch (error) {
            next(error);
            return;
        }
    }
}

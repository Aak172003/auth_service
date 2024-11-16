import { Repository } from "typeorm";
import { ITenant } from "../types";
import { Tenant } from "../entity/Tenant";

export class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {}
    async create(tenantData: ITenant) {
        const createTenant = await this.tenantRepository.save(tenantData);

        console.log("createTenant ---------------- ", createTenant);

        return createTenant;
    }
}

import { DataSource, Repository } from "typeorm";
import logger from "./set-up/logger";
import { Tenant } from "./entity/tenant";

export const calculateDiscount = (price: number, percentage: number) => {
    return price * (percentage / 100);
};

export const truncateTables = async (connection: DataSource) => {
    // This provide all enities lies which i had created in this entity folder
    const entities = connection.entityMetadatas;

    // Loop over entities
    for (const entity of entities) {
        // this will show repositery
        const repositery = connection.getRepository(entity.name);

        // clear is like clear all the columns
        await repositery.clear();
    }
};

// rturn type of this function is boolean
export const isJWT = (token: string | null): boolean => {
    // if we have no token
    if (token === null) {
        return false;
    }

    // split
    const parts = token.split(".");

    if (parts.length !== 3) {
        return false;
    }
    try {
        parts.forEach((part) => {
            Buffer.from(part, "base64").toString("utf-8");
        });
        return true;
    } catch (error) {
        logger.error("tokan can follow the JWT format", error);
        return false;
    }
};

export const createTenant = async (repository: Repository<Tenant>) => {
    const tenantData = {
        name: "Test tenant name",
        address: "Test tenant Address",
    };
    const tenant = await repository.save(tenantData);

    console.log("tenant created --------------- ", tenant);

    return tenant;
};

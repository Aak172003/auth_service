import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Config } from ".";

const { DB_PORT, NODE_ENV, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } =
    Config;

console.log("Config.DB_NAME from data-source ------ ", DB_NAME);
console.log(`For data-source ${NODE_ENV} ENVIRONMENT`);

console.log("DB_USERNAME from data source ---- ", DB_USERNAME);

console.log("DB_USERNAME from data source ---- ", DB_HOST);
console.log("DB_USERNAME from data source ---- ", DB_USERNAME);
console.log("DB_USERNAME from data source ---- ", DB_PORT);
console.log("DB_USERNAME from data source ---- ", DB_PASSWORD);

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: 5432,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,

    // This synchronize make sure for developement and testing true ,
    // but fot profuction case make sure this value is false
    // Don't use this in production
    // synchronize: true,

    // synchronise true sirf dev and test ke time pr rhe to hi better hoga , becasue prod me synchronise true hoga so wo sync me rhega agr mai dev me changes krta hu to wo prod ki entities me refrect krega
    // But hum chahte hai ki , prod me any changes reflect kre tb jb migration execute ho

    synchronize: NODE_ENV === "test" || NODE_ENV === "dev",
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});

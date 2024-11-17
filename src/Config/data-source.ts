import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from ".";

// console.log("Config.DB_NAME from data-source ------ ", Config.DB_NAME);
// console.log(`For data-source ${Config.NODE_ENV} ENVIRONMENT`);

// console.log("DB_USERNAME from data source ---- ", Config.DB_USERNAME);

// console.log("DB_USERNAME from data source ---- ", Config.DB_HOST);
// console.log("DB_USERNAME from data source ---- ", Config.DB_USERNAME);
// console.log("DB_USERNAME from data source ---- ", Config.DB_PORT);
// console.log("DB_USERNAME from data source ---- ", Config.DB_PASSWORD);

export const AppDataSource = new DataSource({
    type: "postgres",
    host: Config.DB_HOST,
    port: 5432,
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,

    // This synchronize make sure for developement and testing true ,
    // but fot profuction case make sure this value is false
    // Don't use this in production
    // synchronize: true,

    // synchronise true sirf dev and test ke time pr rhe to hi better hoga , becasue prod me synchronise true hoga so wo sync me rhega agr mai dev me changes krta hu to wo prod ki entities me refrect krega
    // But hum chahte hai ki , prod me any changes reflect kre tb jb migration execute ho

    // synchronize: NODE_ENV === "test" || NODE_ENV === "dev",
    // now mannually hum synchronise kr rhe hai using connection.synchronise()

    synchronize: false, // for developemenet because here hum synchronise hi kr rhe hai
    logging: false,

    // entities: [User, RefreshToken],
    entities: ["src/entity/*.{ts,js}"],
    // this is wild card pattern . here src/entity/*.ts -> * means any filename with .ts extension from src/entity directory
    migrations: ["src/migration/*.{ts, js}"],
    subscribers: [],
});

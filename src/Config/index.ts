import { config } from "dotenv";
import path from "path";

// config();

config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
});

const { PORT, NODE_ENV, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } =
    process.env;

// console.log("Config.DB_NAME from data-source ------ ", DB_NAME);
// console.log(`For data-source ${NODE_ENV} ENVIRONMENT`);

// console.log("DB_USERNAME from data source ---- ", DB_USERNAME);

// console.log("DB_USERNAME from data source ---- ", DB_HOST);
// console.log("DB_USERNAME from data source ---- ", DB_USERNAME);
// console.log("DB_USERNAME from data source ---- ", DB_PORT);
// console.log("DB_USERNAME from data source ---- ", DB_PASSWORD);

export const Config = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
};

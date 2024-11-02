import winston from "winston";
import { Config } from ".";

const logger = winston.createLogger({
    // This level is default,
    // like when i forget to add level, so below tranport inherit this level inside

    // Main level
    level: "info",
    defaultMeta: {
        // log for which serviceName
        serviceName: "auth-service",
    },

    // If i set format here , it work as globallly , for all type of transport
    // This combine keyword is used to apply more than 2 formats

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),

    // storage of logs
    // if we don't give level , so it take level of parent , but if we give so that work on it's logger level
    transports: [
        // Logger inside file
        new winston.transports.File({
            dirname: "logs",
            filename: "combined.log",

            // Because , silly is last level ,
            // and above this level all logger level will show on combined logs
            level: "silly",

            // if silent true , then no console logs create Which means silent is true  in test mode
            silent: Config.NODE_ENV === "test",
        }),

        new winston.transports.File({
            dirname: "logs",
            filename: "info.log",

            level: "info",

            // if silent true , then no console logs create Which means silent is true  in test mode
            silent: Config.NODE_ENV === "test",
        }),

        new winston.transports.File({
            dirname: "logs",
            filename: "error.log",
            level: "error",

            // if silent true , then no console logs create Which means silent is true  in test mode
            silent: Config.NODE_ENV === "test",
        }),

        // This is for console logs
        new winston.transports.Console({
            level: "info",

            // if silent true , then no console logs create Which means silent is true  in test mode
            silent: Config.NODE_ENV === "test",
        }),
    ],
});

export default logger;

import app from "./app";
import { Config } from "./config";
import { AppDataSource } from "./config/data-source";
import logger from "./config/logger";

const startServer = async () => {
    const PORT = Config.PORT;
    try {
        // Need too create connection with database
        await AppDataSource.initialize();

        logger.info("Datbase connect Successfully");

        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);

            logger.info("Server runnign on ", { port: PORT });
            logger.silly("silly mistake");
            logger.error("testing error logs");
        });
    } catch (error: unknown) {
        // Bydefault this error is unknown type error ,
        // so first we need to verify is this error is an instance of Error ,
        // then we will execute logger.error
        // console.log(error);

        if (error instanceof Error) {
            logger.error(error.message, { test: " test error file " });

            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

void startServer();

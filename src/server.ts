import app from "./app";
import { Config } from "./config";
import logger from "./config/logger";

const startServer = () => {
    const PORT = Config.PORT;
    try {
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);

            logger.info("Server runnign on ", { port: PORT });
            logger.silly("silly mistake");
            logger.error("testing error logs");
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

startServer();

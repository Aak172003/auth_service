import "reflect-metadata";

import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";
import authRouter from "./routes/auth";
import tenantRouter from "./routes/tenant";
import cookieParser from "cookie-parser";

const app: express.Express = express();

app.use(express.static("public"));

app.use(express.json());

app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("Welcome to Multi Tenant Auth Service");
});

// API EndPoints
app.use("/auth", authRouter);
app.use("/tenants", tenantRouter);

// Global Middleware -> which automatically execute whenever we hit any api endpoint
// Global error Handler

// Normal Error does not have statuscode , so for statusCode we need to use httperrors library

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
    // console.log("global error : ", error);
    logger.error(error.message);
    const statusCode = error.statusCode || error.status || 500;

    res.status(statusCode).json({
        errors: [
            {
                type: error.name,
                msg: error.message,
                path: "",
                location: "",
                statusCode: statusCode,
            },
        ],
    });
});

export default app;

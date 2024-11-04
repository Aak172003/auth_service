import "reflect-metadata";

import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";
import authRouter from "./routes/auth";

// console.log("express.Express --------------------- ", express.Express)

const app: express.Express = express();

console.log("appppppppppppppppppppppppppppppppppp ", app);

app.get("/", (req, res) => {
    res.send("Welcome to Multi Tenant Auth Service");
});

// API EndPoints

app.use("/auth", authRouter);

// Global Middleware -> which automatically execute whenever we hit any api endpoint
// Global error Handler

// Normal Error does not have statuscode , so for statusCode we need to use httperrors library

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(error.message);
    const statusCode = error.statusCode || 500;

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

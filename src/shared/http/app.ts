import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import AppError from "../errors/AppError";
import routes from "../routes";
import connectToMongoDB from "../../database/db";

const app = express();

app.use(express.json());
const corsOptions = {
    origin: process.env.BASE_URL_CLIENT,
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};

connectToMongoDB();

app.use(cors(corsOptions));

app.use("/api", routes);

app.use(
    (error: any, request: Request, response: Response, next: NextFunction) => {
        console.log(error);
        return response.status((error as AppError).statusCode ?? 500).send({
            message: (error as AppError).message,
            statusCode: (error as AppError).statusCode ?? 500,
        });
    },
);

export default app;

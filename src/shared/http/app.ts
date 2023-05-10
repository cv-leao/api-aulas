import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
const corsOptions = {
    origin: process.env.BASE_URL_CLIENT,
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

export default app;

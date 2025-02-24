import express, { json } from 'express';
import { config } from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';

config();

const app = express();

app.use(json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));


app.use((err,req,res,next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Internal Server Error"
    });
})

export default app;
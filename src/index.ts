import dotenv from "dotenv";
import { Hono } from "hono";
import { throwerr } from "./utils/error.ts";
const app = new Hono();
export default app;
import logger from "./utils/logger.ts";

dotenv.config();
const PORT = String(process.env.PORT);


app.onError((err, c) => {
    logger.error(`Error!: ${err.message}`);
    return c.text('Error! {Canyon}', 500);
});

app.notFound((c) => {
    logger.warn(`Missing Endpoint: ${c.req.url}`);
    return throwerr(
        "errors.com.canyon.common.not_found",
        "The resource you were trying to find could not be found.", [] , 1004, "", 404, c
    );
});

logger.info(`Canyon is running on port ${PORT}`);
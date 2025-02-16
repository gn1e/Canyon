import dotenv from "dotenv";
import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { throwerr } from "./utils/error.ts";
import loader from "./utils/routes.ts";
import { connectToDB } from "./utils/database.ts";
import path from "path";
const app = new Hono();
const routes = new loader(app);
export default app;
import logger from "./utils/logger.ts";

dotenv.config();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
if (isNaN(PORT)) {
    logger.error("shit port");
}

app.use(secureHeaders());

app.use("*", async (c, next) => {
    logger.debug(`${c.req.method} || ${c.req.url}`);
    await next();
});

app.onError((err, c) => {
    logger.error(`Error!: ${err.message}`);
    return throwerr(
        "errors.com.canyon.critical.error",
        "An error has occured, this should be fixed soon.", [] , 1004, "", 404, c
    );
});

app.notFound((c) => {
    logger.warn(`Missing Endpoint: ${c.req.url}`);
    return throwerr(
        "errors.com.canyon.common.not_found",
        "The resource you were trying to find could not be found.", [] , 1004, "", 404, c
    );
});

connectToDB();

logger.canyon(`Canyon is running on port ${PORT}`);

const wowie = path.resolve("./src/fn/routes");
routes.loadfolder(wowie);
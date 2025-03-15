import dotenv from "dotenv";
import logger from "./utils/logger.ts";
import loader from "./utils/routes.ts";
import { Hono } from "hono";
import { throwerr } from "./utils/error.ts";
import { connectToDB } from "./utils/database.ts";

const app = new Hono();
const routes = new loader(app);
export default app;

dotenv.config();
const PORT = process.env.PORT;

Bun.serve({ fetch: app.fetch, port: PORT, development: false });

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

logger.info(`Canyon is running on port ${PORT}`);

routes.loadfolder("./src/fn/routes"); // idk why need to include src but it works???
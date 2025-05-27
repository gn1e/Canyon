import dotenv from "dotenv";
import logger from "./utils/logger.ts";
import loader from "./utils/routes.ts";
import { Hono } from "hono";
import { throwError } from "./utils/error.ts";
import { connectToDB } from "./utils/database.ts";

const app = new Hono();
const routes = new loader(app);
export default app;

dotenv.config();
const PORT = process.env.PORT;

Bun.serve({ fetch: app.fetch, port: PORT, development: false });

app.onError((err, c) => {
    logger.error(`Error!: ${err.message}`);
    return throwError(
        "errors.com.canyon.critical.error",
        "An error has occured, please report this to support.", [] , 1004, "", 404, c
    );
});

app.notFound((c) => {
    logger.warning(`Missing Endpoint: ${c.req.url}`);
    return throwError(
        "errors.com.canyon.common.not_found",
        "The resource you were trying to find could not be found.", [] , 1004, "", 404, c
    );
});

connectToDB();

logger.information(`Canyon is running and listening on port ${PORT}.`);

routes.loadfolder("./src/fn/routes");
routes.loadfolder("./src/fn/operations"); 
import dotenv from "dotenv";
import { Hono } from "hono";
const app = new Hono();
export default app;
import logger from "./utils/logger.ts";

dotenv.config();
const PORT = String(process.env.PORT);


logger.info(`${PORT}`);
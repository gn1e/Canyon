import { Hono } from "hono";
import contentpages from "../../../static/content/contentpages.json"

export default (app: Hono) => {
  app.get("/content/api/pages/*", (c) =>
    c.json(contentpages)
  );
};
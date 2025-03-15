import { Hono } from "hono";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { throwerr } from "../../utils/error";
import User from "../../models/User";

const descret = process.env.SECRET as string;

export default (app: Hono) => {
  app.get("/account/api/public/account/:accountId", async (c) => {
    const accountId = c.req.param("accountId");
    const user = await User.findOne({ accountId }).lean();

    return c.json({
        id: user?.accountId || null,
        displayName: user?.username || null,
        externalAuths: {},
      });
   });

   
  app.get("/account/api/public/account/:accountId/externalAuths", (c) => {
    c.status(204);
    return c.json({});
  });

  app.get("/account/api/public/account/displayName/:username", async (c) => {
    const username = c.req.param("username");
    const user = await User.findOne({ username }).lean();

    if (!user) 
        return throwerr(
            "errors.com.canyon.common.not_found",
            "The user you were trying to find could not be found.", [] , 1004, "", 404, c
        );

    return c.json({
      id: user.accountId,
      displayName: user.username,
      externalAuths: {},
    });
  });

  app.get("/account/api/public/account", async (c) => {
    const accountIds = c.req.queries()["accountId"];
    if (!accountIds) return c.json([]);

    const ids = Array.isArray(accountIds) ? accountIds : [accountIds];
    const users = await User.find({ accountId: { $in: ids.slice(0, 100) } }).lean();
    
    const response = users.map(user => ({
      id: user.accountId,
      displayName: user.username,
      externalAuths: {},
    }));

    return c.json(response);
  });
}

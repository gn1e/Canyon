import { Hono } from "hono";
import { throwError } from "../../utils/error";
import User from "../../models/User";

export default (app: Hono) => {
  app.get("/account/api/public/account/:accountId", async (c) => {
    const accountId = c.req.param("accountId");
    const user = await User.findOne({ accountId }).lean();

    if (!user) {
      return throwError(
        "errors.com.canyon.common.not_found",
        "The user you were trying to find could not be found.", [] , 1004, "", 404, c
      );
    }

    return c.json({
      id: user.accountId,
      displayName: user.username,
      email: user.email,
      failedLoginAttempts: 0,
      lastLogin: new Date().toISOString(),
      numberOfDisplayNameChanges: 0,
      ageGroup: "UNKNOWN",
      headless: false,
      country: "EU",
      preferredLanguage: "en",
      lastDisplayNameChange: "0000-00-00T00:00:00.000Z",
      canUpdateDisplayName: false,
      tfaEnabled: false,
      emailVerified: true,
      minorVerified: false,
      minorExpected: false,
      minorStatus: "NOT_MINOR",
      cabinedMode: false,
      hasHashedEmail: false,
    });
   });

   
  app.get("/account/api/public/account/:accountId/externalAuths", (c) => {
    return c.body(null, 204);
  });

  app.get("/account/api/public/account/displayName/:username", async (c) => {
    const username = c.req.param("username");
    const user = await User.findOne({ username }).lean();

    if (!user) 
        return throwError(
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

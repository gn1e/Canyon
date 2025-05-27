import { Hono } from "hono";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { throwError } from "../../utils/error";
import User from "../../models/User";

const SECRET = process.env.SECRET as string;

export default (app: Hono) => {
  app.post("/account/api/oauth/token", async (c) => {
    const formBody = new URLSearchParams(await c.req.text());
    const grant_type = formBody.get("grant_type");

    if (!grant_type) {
      return throwError(
        "errors.com.canyon.common.bad_request",
        "Invalid grant type.", [], 1004, "", 400, c
      );
    }

    const client_id = "ec684b8c687f479fadea3cb2ad83f5c6";

    if (grant_type === "password") {
      const username = formBody.get("username");
      const password = formBody.get("password");
    
      if (!username || !password) {
        return throwError(
          "errors.com.canyon.common.bad_request",
          "Missing username or password.", [], 1004, "", 400, c
        );
      }
    
      const user = await User.findOne({ email: username });
    
      if (!user) {
        return throwError(
          "errors.com.canyon.common.not_found",
          "Account is nonexistant.", [], 1004, "", 400, c
        );
      }
    
      if (user.banned) {
        return throwError(
          "errors.com.canyon.common.account_inactive",
          "You are currently banned from Fortnite.", [], 1004, "", 400, c
        );
      }
    
      const device_id = uuidv4();
      const perms = [
        { resource: "launcher:download:live", action: 2 },
        { resource: "catalog:shared:*", action: 2 },
      ];
    
      const tokens = GenerateToken(user.accountId, user.username, device_id, client_id, perms);
    
      return c.json(tokens);
    } else if (grant_type === "refresh_token") {
      return throwError(
        "errors.com.canyon.common.bad_request",
        "refresh_token is currently not supported.", [], 1004, "", 400, c
      );
    }
    
    else if (grant_type === "client_credentials") {
      const token_type = formBody.get("token_type");
      const perms = [
        { resource: "launcher:download:live", action: 2 },
        { resource: "catalog:shared:*", action: 2 },
      ];
    
      const access_token = jwt.sign(
        { auth_method: "client_credentials", client_id, perms },
        SECRET,
        { expiresIn: "4h" }
      );
    
      return c.json({
        access_token: token_type ? `${token_type}~${access_token}` : access_token,
        expires_in: 14400,
        expires_at: new Date(Date.now() + 14400 * 1000).toISOString(),
        token_type: "bearer",
        client_id,
        internal_client: true,
        client_service: "prod-fn",
        product_id: "prod-fn",
        application_id: "fghi4567FNFBKFz3E4TROb0bmPS8h1GW",
      });
    }

    return throwError(
      "errors.com.canyon.common.invalid_request",
      "Unsupported grant type.", [], 1004, "", 400, c
    );
  });

  app.get("/account/api/oauth/verify", async (c) => {
    const authorization = c.req.header("authorization");

    if (!authorization) {
      return throwError(
        "errors.com.canyon.common.not_found",
        "Authorization header is missing.", [], 1004, "", 400, c
      );
    }

    try {
      const token = authorization.replace("bearer ", "").replace("eg1~", "");
      const userToken = jwt.verify(token, SECRET) as any;

      return c.json({
        token,
        session_id: uuidv4(),
        token_type: "bearer",
        client_id: userToken.client_id,
        internal_client: true,
        client_service: "launcher",
        account_id: userToken.account_id,
        expires_in: 16462,
        expires_at: new Date(Date.now() + 16462 * 1000).toISOString(),
        auth_method: userToken.auth_method,
        display_name: userToken.displayName,
        app: "launcher",
        in_app_id: userToken.account_id,
        perms: userToken.perms,
      });
    } catch (error) {
      return throwError(
        "errors.com.canyon.common.invalid_token",
        "Invalid token.", [], 1004, "", 400, c
      );
    }
  });

  app.delete("/account/api/oauth/sessions/kill/:session", async (c) => {
    return c.json({ status: "OK" });
  });

  app.delete("/account/api/oauth/sessions/kill", async (c) => {
    return c.json({ status: "OK" });
  });
};

function GenerateToken(account_id: string, displayName: string, device_id: string, client_id: string, perms: any[]) {
  const access_token = jwt.sign(
    { auth_method: "refresh_token", account_id, displayName, device_id, client_id, perms },
    SECRET,
    { expiresIn: "2h" }
  );

  const refresh_token = jwt.sign(
    { auth_method: "refresh_token", account_id, device_id, client_id, perms },
    SECRET,
    { expiresIn: "8h" }
  );

  return {
    access_token: `eg1~${access_token}`,
    expires_in: 7200,
    expires_at: new Date(Date.now() + 7200 * 1000).toISOString(),
    token_type: "bearer",
    refresh_token: `eg1~${refresh_token}`,
    refresh_expires: 28800,
    refresh_expires_at: new Date(Date.now() + 28800 * 1000).toISOString(),
    account_id,
    client_id,
    internal_client: true,
    client_service: "fortnite",
    displayName,
    app: "fortnite",
    in_app_id: account_id,
    device_id,
    perms,
  };
}

import { Hono } from "hono";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { throwerr } from "../../utils/error";
import User from "../../models/User";

const descret = process.env.SECRET as string;

export default (app: Hono) => {
  app.post("/account/api/oauth/token", async (c) => {
    const formBody = new URLSearchParams(await c.req.text());
    const grant_type = formBody.get("grant_type");

    if (!grant_type) {
      return throwerr(
        "errors.com.canyon.common.bad_request",
        "grant_type is required.",
        [],
        1004,
        "",
        400,
        c
      );
    }

    const client_id = "ec684b8c687f479fadea3cb2ad83f5c6"; 

    if (grant_type === "password") {
      return passgrant(c, formBody, client_id);
    } else if (grant_type === "refresh_token") {
      return refreshtoken(c, formBody);
    }
    else if (grant_type === "client_credentials") {
      return cleintcreds(c, formBody, client_id);
    }

    return throwerr(
      "errors.com.canyon.common.invalid_request",
      "Unsupported grant_type.",
      [],
      1004,
      "",
      400,
      c
    );
  });

  app.get("/account/api/oauth/verify", async (c) => {
    const authorization = c.req.header("authorization");

    if (!authorization) {
      return throwerr(
        "errors.com.canyon.common.not_found",
        "Authorization header is missing.",
        [],
        1004,
        "",
        404,
        c
      );
    }

    try {
      const token = authorization.replace("bearer ", "").replace("eg1~", "");
      const userToken = jwt.verify(token, descret) as any;

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
      return throwerr(
        "errors.com.canyon.common.invalid_token",
        "Invalid token.",
        [],
        1004,
        "",
        401,
        c
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

// tried to make the endpoints look more clean but idk??

async function passgrant(
  c: any,
  formBody: URLSearchParams,
  client_id: string
) {
  const username = formBody.get("username");
  const password = formBody.get("password");

  if (!username || !password) {
    return throwerr(
      "errors.com.canyon.common.bad_request",
      "Missing username or password.",
      [],
      1004,
      "",
      400,
      c
    );
  }

  const user = await User.findOne({ "accountInfo.email": username });

  if (!user) {
    return throwerr(
      "errors.com.canyon.common.not_found",
      "Account not found.",
      [],
      1004,
      "",
      404,
      c
    );
  }

  if (user.banned) {
    return throwerr(
      "errors.com.canyon.common.account_inactive",
      "You are banned from Fortnite.",
      [],
      1004,
      "",
      403,
      c
    );
  }

  const device_id = uuidv4();
  const perms = [
    { resource: "launcher:download:live", action: 2 },
    { resource: "catalog:shared:*", action: 2 },
  ];

  const tokens = gentoken(user.accountId, user.username, device_id, client_id, perms);

  return c.json(tokens);
}

async function refreshtoken(c: any, formBody: URLSearchParams) {
  const refresh_token = formBody.get("refresh_token");

  if (!refresh_token) {
    return throwerr(
      "errors.com.canyon.common.not_found",
      "refresh_token not found in request body.",
      [],
      1004,
      "",
      404,
      c
    );
  }

  try {
    const userToken = jwt.verify(refresh_token.replace("eg1~", ""), descret) as any;

    const user = await User.findOne({ "accountId": userToken.account_id });

    if (!user) {
      return throwerr(
        "errors.com.canyon.common.not_found",
        "Account not found.",
        [],
        1004,
        "",
        404,
        c
      );
    }

    const tokens = gentoken(
      user.accountId,
      user.username,
      userToken.device_id,
      userToken.client_id,
      userToken.perms
    );

    return c.json(tokens);
  } catch (error) {
    return throwerr(
      "errors.com.canyon.common.invalid_token",
      "Invalid refresh token.",
      [],
      1004,
      "",
      401,
      c
    );
  }
}

async function cleintcreds(c: any, formBody: URLSearchParams, client_id: string) {
  const token_type = formBody.get("token_type");
  const perms = [
    { resource: "launcher:download:live", action: 2 },
    { resource: "catalog:shared:*", action: 2 },
  ];

  const access_token = jwt.sign(
    { auth_method: "client_credentials", client_id, perms },
    descret,
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


function gentoken(account_id: string, displayName: string, device_id: string, client_id: string, perms: any[]) {
  const access_token = jwt.sign(
    { auth_method: "refresh_token", account_id, displayName, device_id, client_id, perms },
    descret,
    { expiresIn: "2h" }
  );

  const refresh_token = jwt.sign(
    { auth_method: "refresh_token", account_id, device_id, client_id, perms },
    descret,
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

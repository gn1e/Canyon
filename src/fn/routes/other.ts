import { Hono } from "hono";
import contentpages from "../../../static/content/contentpages.json"

export default (app: Hono) => {
  app.get("/content/api/pages/*", (c) =>
    c.json(contentpages)
  );

  app.get("/waitingroom/api/waitingroom", (c) =>
    c.body(null, 204, {
        'X-Message': 'Thanks for using Canyon!',
        'Content-Type': 'text/plain',
      })
  );

  app.get("/fortnite/api/version", (c) =>
    c.json({
      app: "fortnite",
      serverDate: new Date().toISOString(),
      overridePropertiesVersion: "unknown",
      cln: "17951730",
      build: "444",
      moduleName: "Fortnite-Core",
      buildDate: "2021-10-27T21:00:51.697Z",
      version: "18.30",
      branch: "Release-18.30",
      modules: {
        "Epic-LightSwitch-AccessControlCore": {
          cln: "17237679",
          build: "b2130",
          buildDate: "2021-08-19T18:56:08.144Z",
          version: "1.0.0",
          branch: "trunk",
        },
        "epic-xmpp-api-v1-base": {
          cln: "5131a23c1470acbd9c94fae695ef7d899c1a41d6",
          build: "b3595",
          buildDate: "2019-07-30T09:11:06.587Z",
          version: "0.0.1",
          branch: "master",
        },
        "epic-common-core": {
          cln: "17909521",
          build: "3217",
          buildDate: "2021-10-25T18:41:12.486Z",
          version: "3.0",
          branch: "TRUNK",
        },
      },
    })
  );

  app.get("/fortnite/api/v2/versioncheck/:platform", (c) => // work smarter not harder
    c.json({ type: "NO_UPDATE" })
  );

  app.get("/fortnite/api/game/v2/privacy/account/:accountId", (c) => {
    const accountId = c.req.param("accountId");

    const privacySettings = {
      accountId: accountId,
      optOutOfPublicLeaderboards: false, // make this proper 1day??
    };

    return c.json(privacySettings);
  });

  app.post("/datarouter/*", (c) => 
    c.json({ status: "OK" })
  );

  app.get("/fortnite/api/discovery/accessToken/:branch", (c) => {
    const branch = c.req.param("branch");
    return c.json({
      branchName: branch,
      appId: "Fortnite",
      token: "reallysecuretoken",
    });
  });

  app.get("/fortnite/api/game/v2/enabled_features", (c) => {
    return c.json([]);
  });

  app.post("/fortnite/api/game/v2/grant_access/*", (c) => {
    c.status(204);
    return c.json({});
  });
  
  app.post("/fortnite/api/game/v2/tryPlayOnPlatform/account/*", (c) => {
    c.header("Content-Type", "text/plain");
    return c.text("true");
  });
};
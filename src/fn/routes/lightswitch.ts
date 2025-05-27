import { Hono } from "hono";
import { getConnInfo } from 'hono/cloudflare-workers';
import User from "../../models/User.ts"

export default (app: Hono) => {
  app.get("/lightswitch/api/service/Fortnite/status", async (c) => {
    const info = getConnInfo(c);
    const ip = info.remote.address;
    const user = await User.findOne({ "ip": ip });
    const bannedstatus = user?.banned ?? false;
    return c.json([{
      serviceInstanceId: "fortnite",
      status: "UP",
      message: "Fortnite is online",
      maintenanceUri: null,
      overrideCatalogIds: ["a7f138b2e51945ffbfdacc1af0541053"],
      allowedActions: ["PLAY", "DOWNLOAD"],
      banned: bannedstatus,
      launcherInfoDTO: {
        appName: "Fortnite",
        catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
        namespace: "fn",
      },
    }])
  });

  app.get("/lightswitch/api/service/bulk/status", async (c) => {
    const info = getConnInfo(c);
    const ip = info.remote.address;
    const user = await User.findOne({ "ip": ip });
    const bannedstatus = user?.banned ?? false;
    return c.json([{
      serviceInstanceId: "fortnite",
      status: "UP",
      message: "fortnite is up.",
      maintenanceUri: null,
      overrideCatalogIds: ["a7f138b2e51945ffbfdacc1af0541053"],
      allowedActions: ["PLAY", "DOWNLOAD"],
      banned: bannedstatus,
      launcherInfoDTO: {
        appName: "Fortnite",
        catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
        namespace: "fn",
      },
    }])
  });
};

import { Hono } from "hono";

export default (app: Hono) => {
  app.get("/lightswitch/api/service/Fortnite/status", (c) =>
    c.json({
      serviceInstanceId: "fortnite",
      status: "UP",
      message: "Fortnite is online",
      maintenanceUri: null,
      overrideCatalogIds: ["a7f138b2e51945ffbfdacc1af0541053"],
      allowedActions: [],
      banned: false,
      launcherInfoDTO: {
        appName: "Fortnite",
        catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
        namespace: "fn",
      },
    })
  );

  app.get("/lightswitch/api/service/bulk/status", (c) =>
    c.json({
      serviceInstanceId: "fortnite",
      status: "UP",
      message: "Fortnite is up.",
      maintenanceUri: null,
      overrideCatalogIds: ["a7f138b2e51945ffbfdacc1af0541053"],
      allowedActions: [],
      banned: false,
      launcherInfoDTO: {
        appName: "Fortnite",
        catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
        namespace: "fn",
      },
    })
  );
};

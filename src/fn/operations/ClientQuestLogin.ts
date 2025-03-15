import { Hono } from "hono";

export default (app: Hono) => {
    app.post('/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin', (c) => {
        return c.json({
            status: "OK"
        })
    })
};

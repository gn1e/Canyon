import { Hono } from "hono";
import keychain from "../../../static/storefront/keychain.json"

export default (app: Hono) => {
    app.get('/fortnite/api/storefront/v2/keychain', (c) => {
        return c.json(keychain);
    })
};

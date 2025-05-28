import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { createProfile } from "../../utils/profile.ts";
import User from "../../models/User.ts"

export default (app: Hono) => {
  app.post("/register", async (c) => {
    const { email, password, username } = await c.req.json();
    if (!email || !password || !username) {
        return c.json("Missing params!");
    }
    const accountId = uuidv4();

    await User.create({
        accountId: accountId,
        username: username,
        email: email,
        password: password,
        created: new Date(),
    })

    createProfile(accountId);

    const user = await User.findOne({ 'accountInfo.id': accountId });
    if (!user) {
        return c.json("can't find the new account?");
    }

    return c.json({
        accountId: user.accountId,
        username: user.username,
        email: user.email,
        created: user.created
    });
  });
};

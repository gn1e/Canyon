import fs from "fs";
import Profile from "../models/profile";

export async function createProfile(accountId: string) {
    let profiles: any = {};

    const dir = new URL("../../static/profiles/", import.meta.url);
    const files = fs.readdirSync(dir);

    for (const fileName of files) {
        const filePath = new URL(fileName, dir);
        const module = await import(filePath.toString());

        const profile = module.default || module;

        profile.accountId = accountId;
        profile.created = new Date().toISOString();
        profile.updated = new Date().toISOString();

        profiles[profile.profileId] = profile;
    }

    const profileData = {
        created: new Date(),
        accountId: accountId,
        profiles: profiles
    };

    const profile = new Profile(profileData);
    await profile.save();
    return profile;
}

import { Hono } from "hono";
import Profile from "../../models/profile"

export default (app: Hono) => {
    app.post('/fortnite/api/game/v2/profile/:accountId/client/QueryProfile', async (c) => {
        const { profileId, rvn } = c.req.query();
        var profiles: any = await Profile.findOne({ accountId: c.req.param("accountId") });
        let profile = profiles?.profiles[profileId];
        let build = process.env.BUILD;
        if (!build) {
            build = "0.00"
        }
        const season = Number(build.split(".")[0])
        let MultiUpdate: any = [];
        let ApplyProfileChanges: any = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (Number(build) >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = rvn || -1;

        if (!profile || !profiles) {
          return c.json({
            profileRevision: 0,
            profileId: profileId,
            profileChangesBaseRevision: 0,
            profileChanges: [],
            profileCommandRevision: 0,
            serverTime: new Date().toISOString(),
            multiUpdate: [],
            responseVersion: 1,
          });
        }

        if (profileId == "athena") {
            profile.stats.attributes.season_num = season; 

            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();
            await profiles.updateOne({ $set: { [`profiles.${profileId}`]: profile } });
        }

        if (profile.rvn == profile.commandRevision) {
            profile.rvn += 1;

            if (profileId == "athena") {
                if (!profile.stats.attributes.last_applied_loadout) profile.stats.attributes.last_applied_loadout = profile.stats.attributes.loadouts[0];
            }

            await profiles.updateOne({ $set: { [`profiles.${profileId}`]: profile } });
        }

        if ((profileId == "common_core")) {
            let athena = profiles.profiles["athena"];
            MultiUpdate = [{
                "profileRevision": athena.rvn || 0,
                "profileId": "athena",
                "profileChangesBaseRevision": athena.rvn || 0,
                "profileChanges": [{
                    "changeType": "fullProfileUpdate",
                    "profile": athena
                }],
                "profileCommandRevision": athena.commandRevision || 0,
            }];
        }

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        return c.json({
            profileRevision: profile.rvn || 0,
            profileId: profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })
};

import { Hono } from "hono";
import keychain from "../../../static/storefront/keychain.json"

function get_midnight(daysAhead = 1) {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    now.setUTCDate(now.getUTCDate() + daysAhead); 
    return now.toISOString();
}

export default (app: Hono) => {
    app.get('/fortnite/api/calendar/v1/timeline', (c) => {
        const now = new Date();
        let build = process.env.BUILD || "0.00";
        let season = Number(build.split(".")[0]);

        if (build === "1.11") {
            season = 2;
        }
        const dailyEnd = get_midnight();
        const weeklyEnd = get_midnight();
        let activeEvents = [
            {
                "eventType": `EventFlag.Season${season}`,
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-12-26T00:00:00.000Z"
            },
            {
                "eventType": `EventFlag.LobbySeason${season}`,
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-12-26T00:00:00.000Z"
            }
        ];

        if (season === 4 && Number(build) >= 4.5) {
            activeEvents.push(
                {
                    "eventType": "EventFlag.Blockbuster2018Phase4",
                    "activeUntil": "2025-01-20T01:00:00.000Z",
                    "activeSince": "2024-12-26T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.BR_S4_Geode_Countdown",
                    "activeUntil": "2025-01-20T01:00:00.000Z",
                    "activeSince": "2024-12-26T11:00:00.000Z"
                }
            );
        } else if (Number(build) === 5) {
            activeEvents.push(
                {
                    "eventType": "EventFlag.RoadTrip2018",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.Horde",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.Anniversary2018_BR",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.LTM_Heist",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                }
            );

            if (Number(build) === 5.10) {
                activeEvents.push(
                    {
                        "eventType": "EventFlag.BirthdayBattleBus",
                        "activeUntil": "9999-01-01T00:00:00.000Z",
                        "activeSince": "2020-01-01T00:00:00.000Z"
                    }
                );
            }
        } else if (season === 2) {
            activeEvents.push(
                {
                    "eventType": "EventFlag.LobbyWinterDecor",
                    "activeUntil": "2025-01-20T01:00:00.000Z",
                    "activeSince": "2024-12-26T00:00:00.000Z"
                }
            );
        }

        return c.json({
            "channels": {
                "standalone-store": {
                    "states": [
                        {
                            "validFrom": now.toISOString(),
                            "activeEvents": [],
                            "state": {
                                "activePurchaseLimitingEventIds": [],
                                "storefront": {},
                                "rmtPromotionConfig": [],
                                "storeEnd": "0001-01-01T00:00:00.000Z"
                            }
                        }
                    ],
                    "cacheExpire": "9999-01-01T00:00:00.000Z"
                },
                "client-matchmaking": {
                    "states": [
                        {
                            "validFrom": now.toISOString(),
                            "activeEvents": [],
                            "state": {
                                "region": {
                                    "OCE": {
                                        "eventFlagsForcedOff": ["Playlist_DefaultDuo"]
                                    },
                                    "CN": {
                                        "eventFlagsForcedOff": [
                                            "Playlist_DefaultDuo",
                                            "Playlist_Bots_DefaultDuo",
                                            "Playlist_Deimos_DuoCN"
                                        ]
                                    },
                                    "REGIONID": {
                                        "eventFlagsForcedOff": ["Playlist_Deimos_Duo_WinterCN"]
                                    },
                                    "ASIA": {
                                        "eventFlagsForcedOff": ["Playlist_DefaultDuo"]
                                    }
                                }
                            }
                        }
                    ],
                    "cacheExpire": "9999-01-01T00:00:00.000Z"
                },
                "tk": {
                    "states": [
                        {
                            "validFrom": now.toISOString(),
                            "activeEvents": [],
                            "state": {
                                "k": keychain
                            }
                        }
                    ],
                    "cacheExpire": "9999-01-01T00:00:00.000Z"
                },
                "client-events": {
                    "states": [
                        {
                            "validFrom": "2024-12-26T11:00:00.000Z",
                            "activeEvents": activeEvents,
                            "state": {
                                "seasonNumber": season,
                                "seasonTemplateId": `AthenaSeason:athenaseason${season}`,
                                "seasonBegin": "2024-12-26T11:00:00.000Z",
                                "seasonEnd": process.env.SEASON_END,
                                "seasonDisplayedEnd": process.env.SEASON_END,
                                "weeklyStoreEnd": weeklyEnd,
                                "stwWeeklyStoreEnd": weeklyEnd,
                                "sectionStoreEnds": {
                                    "Daily": dailyEnd,
                                    "Featured": weeklyEnd
                                },
                                "dailyStoreEnd": dailyEnd
                            }
                        }
                    ],
                    "cacheExpire": "9999-01-01T00:00:00.000Z"
                }
            },
            "cacheIntervalMins": 15,
            "currentTime": now.toISOString()
        });
    })
};

import { describe, it, expect, vi } from "vitest";
import {NOTIFICATION_TYPE_SYSTEM, SpinShareClient, UnauthenticatedError} from "../src/index.ts";
import axios from "axios";

vi.mock("axios");

describe("connectGetNotifications", () => {
    const correctToken = "CORRECT-TOKEN";
    const wrongToken = "WRONG-TOKEN";

    it("should return playlists if token is valid", async () => {
        axios.get.mockResolvedValueOnce({status: 200, data: {
                "version": 1,
                "status": 200,
                "data": [
                    {
                        "id": 1,
                        "user": {
                            "id": 1,
                            "username": "testuser",
                            "isVerified": null,
                            "isPatreon": null,
                            "pronouns": null,
                            "avatar": "http://spinsha.re/uploads/avatar/5f86d761933e1.png"
                        },
                        "notificationType": 0,
                        "notificationData": "Lorem Ipsum dolor sit amet",
                        "connectedSong": null,
                        "connectedUser": null,
                        "connectedCard": null
                    }
                ]
            } });

        const client = new SpinShareClient();
        const notifications = await client.connectGetNotifications(correctToken);

        expect(notifications).toBeDefined();
        expect(notifications[0].id).toBe(1);
        expect(notifications[0].notificationType).toBe(NOTIFICATION_TYPE_SYSTEM);
        vi.clearAllMocks();
    });

    it("should throw 403 if token is invalid", async () => {
        axios.get.mockResolvedValueOnce({status: 403, data: {
                "version":1,
                "status":403,
                "data":[]
            } });

        const client = new SpinShareClient();
        await expect(client.connectGetNotifications(wrongToken)).rejects.toThrowError(UnauthenticatedError);
        vi.clearAllMocks();
    });
});
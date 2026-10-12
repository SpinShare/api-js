import { describe, it, expect, vi } from "vitest";
import {SpinShareClient, UnauthenticatedError} from "../src/index.ts";
import axios from "axios";

vi.mock("axios");

describe("connectGetProfile", () => {
    const correctToken = "CORRECT-TOKEN";
    const wrongToken = "WRONG-TOKEN";

    it("should return profile if token is valid", async () => {
        axios.get.mockResolvedValueOnce({status: 200, data: {
            "version": 1,
            "status": 200,
            "data": {
                "id": 1,
                "username": "test",
                "isVerified": true,
                "isPatreon": null,
                "pronouns": "she/they",
                "avatar": "https://spinsha.re/uploads/avatar/0000000000000.png",
                "notificationsCount": 0
            }
        } });

        const client = new SpinShareClient();
        const profile = await client.connectGetProfile(correctToken);

        expect(profile).toBeDefined();
        expect(profile.id).toBe(1);
        vi.clearAllMocks();
    });

    it("should throw 403 if token is invalid", async () => {
        axios.get.mockResolvedValueOnce({status: 403, data: {
            "version":1,
            "status":403,
            "data":[]
        } });

        const client = new SpinShareClient();
        await expect(client.connectGetProfile(wrongToken)).rejects.toThrowError(UnauthenticatedError);
        vi.clearAllMocks();
    });
});
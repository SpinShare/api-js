import { describe, it, expect, vi } from "vitest";
import {SpinShareClient, UnauthenticatedError} from "../src/index.ts";
import axios from "axios";

vi.mock("axios");

describe("connectGetPlaylists", () => {
    const correctToken = "CORRECT-TOKEN";
    const wrongToken = "WRONG-TOKEN";

    it("should return playlists if token is valid", async () => {
        axios.get.mockResolvedValueOnce({status: 200, data: {
                "version": 1,
                "status": 200,
                "data": [
                    {
                        "id": 1,
                        "title": "This is a test",
                        "description": "Test charts",
                        "fileReference": "playlist_aaaaaaaaaaaaa",
                        "user": {
                            "id": 1,
                            "username": "test",
                            "isVerified": true,
                            "isPatreon": null,
                            "pronouns": "she/they",
                            "avatar": "https://spinsha.re/uploads/avatar/0000000000000.png"
                        },
                        "songs": []
                    }
                ]
            } });

        const client = new SpinShareClient();
        const playlists = await client.connectGetPlaylists(correctToken);

        expect(playlists).toBeDefined();
        expect(playlists[0].id).toBe(1);
        expect(playlists[0].songs).toBeInstanceOf(Array);
        vi.clearAllMocks();
    });

    it("should throw 403 if token is invalid", async () => {
        axios.get.mockResolvedValueOnce({status: 403, data: {
                "version":1,
                "status":403,
                "data":[]
            } });

        const client = new SpinShareClient();
        await expect(client.connectGetPlaylists(wrongToken)).rejects.toThrowError(UnauthenticatedError);
        vi.clearAllMocks();
    });
});
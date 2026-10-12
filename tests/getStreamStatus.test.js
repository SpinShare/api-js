import { describe, it, expect, vi } from "vitest";
import {ServerError, SpinShareClient} from "../src/index.ts";
import axios from "axios";

vi.mock("axios");

describe("getStreamStatus", () => {
    it("should return the stream status", async () => {
        const status = { title: "", viewers: 0, isLive: false };
        axios.get.mockResolvedValueOnce({
            data: {
                version: 1,
                status: 200,
                data: status
            }
        });

        const client = new SpinShareClient();
        const response = await client.getStreamStatus();

        expect(response).toEqual(status);
        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining("/streamStatus"),
            expect.any(Object)
        );
        vi.clearAllMocks();
    });

    it("should throw 500 if the stream status is unavailable", async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                version: 1,
                status: 500,
                data: []
            }
        });

        const client = new SpinShareClient();
        await expect(client.getStreamStatus()).rejects.toThrowError(ServerError);
        vi.clearAllMocks();
    });
});

import { describe, it, expect } from "vitest";
import {NotFoundError, SpinShareClient} from "../src/index.ts";

describe("getUserDetail", () => {
    it("should return a playlist by id", async () => {
        const client = new SpinShareClient();
        const id = 425;
        const response = await client.getPlaylistDetail(id);

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Object);
        expect(response.id).toBe(id);
    });
    it("should return 404 if not found", async () => {
        const client = new SpinShareClient();
        await expect(client.getPlaylistDetail(0)).rejects.toThrowError(NotFoundError);
    });
});
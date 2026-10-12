import { describe, it, expect } from "vitest";
import {NotFoundError, SpinShareClient} from "../src/index.ts";

describe("getChartPlaylists", () => {
    it("should return playlists by id", async () => {
        const client = new SpinShareClient();
        const id = 243;
        const response = await client.getChartPlaylists(id);

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
    });
    it("should return playlists by reference", async () => {
        const client = new SpinShareClient();
        const fileReference = "spinshare_5ea21e89bccec";
        const response = await client.getChartPlaylists(fileReference);

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
    });
    it("should return 404 if not found", async () => {
        const client = new SpinShareClient();
        await expect(client.getChartPlaylists(0)).rejects.toThrowError(NotFoundError);
    });
});
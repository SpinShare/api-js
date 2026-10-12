import { describe, it, expect } from "vitest";
import {SpinShareClient, ValidationError} from "../src/index.js";

describe("getChartUpdateHashes", () => {
    it("should return update hashes by id and reference", async () => {
        const client = new SpinShareClient();
        const id = 1904;
        const fileReference = "spinshare_5fd014fe4afe7";
        const response = await client.getChartUpdateHashes([id, fileReference]);

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
        expect(response.some(chart => chart.id === id)).toBe(true);
        expect(response.some(chart => chart.fileReference === fileReference)).toBe(true);
        response.forEach(chart => expect(chart.updateHash).toBeDefined());
    });
    it("should omit charts that can't be found", async () => {
        const client = new SpinShareClient();
        const response = await client.getChartUpdateHashes([0]);

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
        expect(response.length).toBe(0);
    });
    it("should throw on an empty request", async () => {
        const client = new SpinShareClient();
        await expect(client.getChartUpdateHashes([])).rejects.toThrowError(ValidationError);
    });
});

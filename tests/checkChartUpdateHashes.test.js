import { describe, it, expect } from "vitest";
import {SpinShareClient, ValidationError} from "../src/index.ts";

describe("checkChartUpdateHashes", () => {
    it("should return whether charts are up to date", async () => {
        const client = new SpinShareClient();
        const id = 1904;
        const [chart] = await client.getChartUpdateHashes([id]);
        const response = await client.checkChartUpdateHashes([
            { chart: id, updateHash: chart.updateHash },
            { chart: chart.fileReference, updateHash: "invalid" },
        ]);

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
        expect(response).toEqual([
            { chart: id, isUpToDate: true },
            { chart: chart.fileReference, isUpToDate: false },
        ]);
    });
    it("should throw on an empty request", async () => {
        const client = new SpinShareClient();
        await expect(client.checkChartUpdateHashes([])).rejects.toThrowError(ValidationError);
    });
});

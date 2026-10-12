import { describe, it, expect } from "vitest";
import {SpinShareClient} from "../src/index.ts";

describe("getHotThisWeekCharts", () => {
    it("should return an array of charts", async () => {
        const client = new SpinShareClient();
        const response = await client.getHotThisWeekCharts(0);

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
    });
    it("should paginate properly", async () => {
        const client = new SpinShareClient();
        const responsePage0 = await client.getHotThisWeekCharts(0);
        const responsePage1 = await client.getHotThisWeekCharts(1);

        expect(responsePage0).toBeDefined();
        expect(responsePage1).toBeDefined();
        expect(responsePage0).toBeInstanceOf(Array);
        expect(responsePage1).toBeInstanceOf(Array);

        // Only a full first page guarantees there is a second one
        if(responsePage0.length < 12) {
            expect(responsePage1.length).toBe(0);
            return;
        }

        expect(responsePage1.length).toBeGreaterThan(0);
        expect(responsePage0[0].id === responsePage1[0].id).toBeFalsy();
    });
    it("should return an empty array of charts", async () => {
        const client = new SpinShareClient();
        const response = await client.getHotThisWeekCharts(1_000_000);

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
        expect(response.length).toBeLessThanOrEqual(0);
    });
});
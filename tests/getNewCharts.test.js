import { describe, it, expect } from "vitest";
import {SpinShareClient} from "../src/index.ts";

describe("getNewCharts", () => {
    it("should return an array of charts", async () => {
        const client = new SpinShareClient();
        const response = await client.getNewCharts(0);

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
        expect(response.length).toBeGreaterThan(0);
    });
    it("should paginate properly", async () => {
        const client = new SpinShareClient();
        const responsePage0 = await client.getNewCharts(0);
        const responsePage1 = await client.getNewCharts(1);

        expect(responsePage0).toBeDefined();
        expect(responsePage1).toBeDefined();
        expect(responsePage0).toBeInstanceOf(Array);
        expect(responsePage1).toBeInstanceOf(Array);
        expect(responsePage0.length).toBeGreaterThan(0);
        expect(responsePage1.length).toBeGreaterThan(0);
        expect(responsePage0[0].id === responsePage1[0].id).toBeFalsy();
    });
    it("should return an empty array of charts", async () => {
        const client = new SpinShareClient();
        const response = await client.getNewCharts(1_000_000);

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
        expect(response.length).toBeLessThanOrEqual(0);
    });
});
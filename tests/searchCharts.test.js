import { describe, it, expect } from "vitest";
import {SpinShareClient} from "../src/index.ts";

describe("searchCharts", () => {
    it("should return an array of charts", async () => {
        const client = new SpinShareClient();
        const response = await client.searchCharts("chart");

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
        expect(response.length).toBeGreaterThan(0);
    });
    it("should return an empty array of charts", async () => {
        const client = new SpinShareClient();
        const response = await client.searchCharts("QWERTZUIOPÜASDFGHJKLÖÄYXCVBNM;:_");

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
        expect(response.length).toBeLessThanOrEqual(0);
    });
});
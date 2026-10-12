import { describe, it, expect } from "vitest";
import {NotFoundError, SpinShareClient} from "../src/index.ts";

describe("getChartDetail", () => {
    it("should return a chart by id", async () => {
        const client = new SpinShareClient();
        const id = 1904;
        const response = await client.getChartDetail(id);

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Object);
        expect(response.id).toBe(id);
    });
    it("should return a chart by reference", async () => {
        const client = new SpinShareClient();
        const fileReference = "spinshare_5fd014fe4afe7";
        const response = await client.getChartDetail(fileReference);

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Object);
        expect(response.fileReference).toBe(fileReference);
    });
    it("should return 404 if not found", async () => {
        const client = new SpinShareClient();
        await expect(client.getChartDetail(0)).rejects.toThrowError(NotFoundError);
    });
});
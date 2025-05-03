import { describe, it, expect } from "vitest";
import {SpinShareClient} from "../src/index.js";

describe("getChartDownload", () => {
    it("should return a zip by id", async () => {
        const client = new SpinShareClient();
        const id = 1904;
        const response = await client.getChartDownload(id);

        expect(response).toBeDefined();
        expect(Buffer.isBuffer(response)).toBe(true);

        // Check ZIP magic number (PK header)
        expect(response[0]).toBe(0x50); // 'P'
        expect(response[1]).toBe(0x4B); // 'K'
    });
    it("should return 404 if not found", async () => {
        const client = new SpinShareClient();
        await expect(client.getChartDownload(0)).rejects.toThrowError();
    });
});
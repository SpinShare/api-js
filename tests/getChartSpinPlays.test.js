import { describe, it, expect } from "vitest";
import {NotFoundError, SpinShareClient} from "../src/index.ts";

describe("getChartSpinPlays", () => {
    it("should return SpinPlays by id", async () => {
        const client = new SpinShareClient();
        const id = 243;
        const response = await client.getChartSpinPlays(id);

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Object);
        expect(response.spinPlays).toBeInstanceOf(Array);
    });
    it("should return SpinPlays by reference", async () => {
        const client = new SpinShareClient();
        const fileReference = "spinshare_5ea21e89bccec";
        const response = await client.getChartSpinPlays(fileReference);

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Object);
        expect(response.spinPlays).toBeInstanceOf(Array);
    });
    it("should return 404 if not found", async () => {
        const client = new SpinShareClient();
        await expect(client.getChartSpinPlays(0)).rejects.toThrowError(NotFoundError);
    });
});
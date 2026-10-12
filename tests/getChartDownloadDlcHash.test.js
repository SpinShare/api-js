import { describe, it, expect, vi } from "vitest";
import {SpinShareClient} from "../src/index.js";
import axios from "axios";

vi.mock("axios");

describe("getChartDownload with DLC hash", () => {
    const zipResponse = {
        headers: { 'content-type': 'application/zip' },
        data: Buffer.from([0x50, 0x4B]),
    };

    it("should send the DLC hash header if provided", async () => {
        axios.get.mockResolvedValueOnce(zipResponse);

        const client = new SpinShareClient({ dlcHash: "abc" });
        await client.getChartDownload(1234);

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining("/song/1234/download"),
            expect.objectContaining({ headers: { 'SPSH-DLC-Hash': "abc" } })
        );
        vi.clearAllMocks();
    });

    it("should not send the DLC hash header by default", async () => {
        axios.get.mockResolvedValueOnce(zipResponse);

        const client = new SpinShareClient();
        await client.getChartDownload(1234);

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining("/song/1234/download"),
            expect.objectContaining({ headers: {} })
        );
        vi.clearAllMocks();
    });
});

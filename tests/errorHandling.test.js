import { describe, it, expect, vi } from "vitest";
import {
    ApiMismatchError,
    ApiStatusError,
    NotFoundError,
    ServerError,
    SpinShareClient,
    SpinShareError,
    UnauthenticatedError,
} from "../src/index.ts";
import axios from "axios";

vi.mock("axios");

describe("error handling", () => {
    it("should map HTTP status codes when the body has no status", async () => {
        axios.get.mockResolvedValueOnce({ status: 401, data: "Unauthorized" });

        const client = new SpinShareClient();
        await expect(client.getDlcs()).rejects.toThrowError(UnauthenticatedError);
        vi.clearAllMocks();
    });

    it("should use the error message of the server", async () => {
        axios.get.mockResolvedValueOnce({
            status: 500,
            data: { version: 1, status: 500, data: { error: "Something broke" } },
        });

        const client = new SpinShareClient();
        await expect(client.getDlcs()).rejects.toThrowError(new ServerError("Something broke"));
        vi.clearAllMocks();
    });

    it("should throw ApiStatusError on unexpected status codes", async () => {
        axios.get.mockResolvedValueOnce({ status: 405, data: { version: 1, status: 405, data: [] } });

        const client = new SpinShareClient();
        await expect(client.getDlcs()).rejects.toThrowError(ApiStatusError);
        vi.clearAllMocks();
    });

    it("should throw ApiMismatchError on unsupported versions", async () => {
        axios.get.mockResolvedValueOnce({ status: 200, data: { version: 2, status: 200, data: [] } });

        const client = new SpinShareClient();
        await expect(client.getDlcs()).rejects.toThrowError(ApiMismatchError);
        vi.clearAllMocks();
    });

    it("should name errors after their class", async () => {
        axios.get.mockResolvedValueOnce({ status: 200, data: { version: 1, status: 404, data: [] } });

        const client = new SpinShareClient();
        const error = await client.getDlcs().catch((e) => e);

        expect(error).toBeInstanceOf(NotFoundError);
        expect(error).toBeInstanceOf(SpinShareError);
        expect(error.name).toBe("NotFoundError");
        vi.clearAllMocks();
    });

    it("should throw if a download returns JSON without an error", async () => {
        axios.get.mockResolvedValueOnce({
            status: 200,
            headers: { "content-type": "application/json" },
            data: new TextEncoder().encode(JSON.stringify({ version: 1, status: 200, data: [] })),
        });

        const client = new SpinShareClient();
        await expect(client.getChartDownload(1234)).rejects.toThrowError(ApiStatusError);
        vi.clearAllMocks();
    });
});

import { describe, it, expect, vi } from "vitest";
import {SpinShareClient} from "../src/index.ts";
import axios from "axios";

vi.mock("axios");

describe("connectGetToken", () => {
    const correctToken = "CORRECT-TOKEN";
    const wrongToken = "WRONG-TOKEN";

    it("should return true if token is valid", async () => {
        axios.get.mockResolvedValueOnce({status: 200, data: {
            status: 200,
            version: 1,
            data: [],
        } });

        const client = new SpinShareClient();
        const isValid = await client.connectValidateToken(correctToken);

        expect(isValid).toBeTruthy();
        vi.clearAllMocks();
    });

    it("should return false if token is invalid", async () => {
        axios.get.mockResolvedValueOnce({status: 200, data: {
            status: 404,
            version: 1,
            data: [],
        } });

        const client = new SpinShareClient();
        const isValid = await client.connectValidateToken(wrongToken);

        expect(isValid).toBeFalsy();
        vi.clearAllMocks();
    });

    it("should rethrow errors unrelated to the token", async () => {
        axios.get.mockRejectedValueOnce(new Error("Network Error"));

        const client = new SpinShareClient();
        await expect(client.connectValidateToken(correctToken)).rejects.toThrowError("Network Error");
        vi.clearAllMocks();
    });
});
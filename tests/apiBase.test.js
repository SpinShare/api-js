import { describe, it, expect } from "vitest";
import {SpinShareClient} from "../src/index.ts";

describe("apiBase", () => {
    it("should be defined by default", () => {
        const client = new SpinShareClient();
        expect(client.apiBase).toBe("https://spinsha.re/api");
    });

    it("should be settable in the constructor", () => {
        const client = new SpinShareClient({ apiBase: "https://example.org" });
        expect(client.apiBase).toBe("https://example.org");
    });

    it("should be changeable", () => {
        const client = new SpinShareClient();
        client.setApiBase("https://example.org");
        expect(client.apiBase).toBe("https://example.org");
    });
});
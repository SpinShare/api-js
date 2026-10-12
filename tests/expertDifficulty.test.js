import { describe, it, expect, vi } from "vitest";
import {SpinShareClient} from "../src/index.ts";
import axios from "axios";

vi.mock("axios");

const respond = (data) => ({ status: 200, data: { version: 1, status: 200, data } });

describe("expert difficulty naming", () => {
    it("should rename the legacy flag of discovery charts", async () => {
        axios.get.mockResolvedValueOnce(respond([
            { id: 1, hasExtremeDifficulty: true, expertDifficulty: 30 },
            { id: 2, hasExtremeDifficulty: false, expertDifficulty: null },
        ]));

        const client = new SpinShareClient();
        const charts = await client.getNewCharts(0);

        expect(charts[0]).toEqual({ id: 1, hasExpertDifficulty: true, expertDifficulty: 30 });
        expect(charts[1]).toEqual({ id: 2, hasExpertDifficulty: false, expertDifficulty: null });
        vi.clearAllMocks();
    });

    it("should prefer the expert flag if both are present", async () => {
        axios.get.mockResolvedValueOnce(respond({ id: 1, hasExtremeDifficulty: false, hasExpertDifficulty: true }));

        const client = new SpinShareClient();
        const chart = await client.getChartDetail(1);

        expect(chart).toEqual({ id: 1, hasExpertDifficulty: true });
        vi.clearAllMocks();
    });

    it("should rename the legacy flag of nested charts", async () => {
        axios.get.mockResolvedValueOnce(respond({
            average: 100,
            reviews: [{ id: 1, song: { id: 1, hasExtremeDifficulty: true, hasExpertDifficulty: true } }],
        }));

        const client = new SpinShareClient();
        const reviews = await client.getChartReviews(1);

        expect(reviews.reviews[0].song).toEqual({ id: 1, hasExpertDifficulty: true });
        vi.clearAllMocks();
    });
});

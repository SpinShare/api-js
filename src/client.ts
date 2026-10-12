import axios from "axios";
import type {
    ChartIdOrReference,
    User,
    UserDetail,
    ConnectProfile,
    Dlc,
    ChartDetail,
    SearchChart,
    MappoolChart,
    DiscoveryChart,
    UserChart,
    Playlist,
    PlaylistDetail,
    PlaylistSummary,
    Review,
    ChartReviews,
    SpinPlay,
    ChartSpinPlays,
    Promo,
    StreamStatus,
    Notification,
    ChartUpdateHash,
    ChartUpdateHashCheck,
    ChartUpdateHashCheckResult,
    SearchChartsOptions,
    SpinShareClientOptions,
} from "./types.js";
import { checkResponse, getConnect, getOpen, postConnect, postOpen, validateStatus } from "./http.js";
import { ApiStatusError, NotFoundError, UnauthenticatedError, ValidationError } from "./errors.js";

export class SpinShareClient {
    apiBase: string;
    dlcHashes: string[];
    connectApiKey: string | null;

    constructor({ apiBase = "https://spinsha.re/api", dlcHashes = [], connectApiKey = null }: SpinShareClientOptions = {}) {
        this.apiBase = apiBase;
        this.dlcHashes = dlcHashes;
        this.connectApiKey = connectApiKey;
    }

    setApiBase(newApiBase: string): void {
        this.apiBase = newApiBase;
    }

    /**
     * Returns charts based on the searchQuery provided.
     * @param searchQuery - The search term or keywords to find matching charts.
     * @param options - Difficulty, rating and explicit content filters.
     * @return A promise that resolves to an array of charts matching the search criteria.
     */
    async searchCharts(searchQuery: string, options: SearchChartsOptions = {}): Promise<SearchChart[]> {
        const apiUrl = `${this.apiBase}/searchCharts`;
        const response = await postOpen<SearchChart[]>(apiUrl, {
            searchQuery,
            ...options
        });

        return response.data;
    }

    /**
     * Returns playlists based on the searchQuery provided.
     * @param searchQuery
     */
    async searchPlaylists(searchQuery: string): Promise<PlaylistSummary[]> {
        const apiUrl = `${this.apiBase}/searchPlaylists`;
        const response = await postOpen<PlaylistSummary[]>(apiUrl, {
            searchQuery,
        });

        return response.data;
    }

    /**
     * Returns users based on the searchQuery provided.
     * @param searchQuery
     */
    async searchUsers(searchQuery: string): Promise<User[]> {
        const apiUrl = `${this.apiBase}/searchUsers`;
        const response = await postOpen<User[]>(apiUrl, {
            searchQuery,
        });

        return response.data;
    }

    /**
     * Returns the 12 newest songs. Use offset for pagination.
     * @param offset - Page index, 12 charts per page.
     */
    async getNewCharts(offset: number): Promise<DiscoveryChart[]> {
        const apiUrl = `${this.apiBase}/songs/new/${offset}`;
        const response = await getOpen<DiscoveryChart[]>(apiUrl);

        return response.data;
    }

    /**
     * Returns 12 songs that were last updated. Use offset for pagination.
     * @param offset - Page index, 12 charts per page.
     */
    async getUpdatedCharts(offset: number): Promise<DiscoveryChart[]> {
        const apiUrl = `${this.apiBase}/songs/updated/${offset}`;
        const response = await getOpen<DiscoveryChart[]>(apiUrl);

        return response.data;
    }

    /**
     * Returns the 12 most popular songs from the last 7 days. Use offset for pagination.
     * @param offset - Page index, 12 charts per page.
     */
    async getHotThisWeekCharts(offset: number): Promise<DiscoveryChart[]> {
        const apiUrl = `${this.apiBase}/songs/hotThisWeek/${offset}`;
        const response = await getOpen<DiscoveryChart[]>(apiUrl);

        return response.data;
    }

    /**
     * Returns the 12 most popular songs from the last month. Use offset for pagination.
     * @param offset - Page index, 12 charts per page.
     */
    async getHotThisMonthCharts(offset: number): Promise<DiscoveryChart[]> {
        const apiUrl = `${this.apiBase}/songs/hotThisMonth/${offset}`;
        const response = await getOpen<DiscoveryChart[]>(apiUrl);

        return response.data;
    }

    /**
     * Checks whether the API is reachable.
     */
    async ping(): Promise<boolean> {
        const apiUrl = `${this.apiBase}/ping`;
        const response = await getOpen<never>(apiUrl);

        return response.pong as boolean;
    }

    /**
     * Returns the 2 newest visible promos.
     */
    async getPromos(): Promise<Promo[]> {
        const apiUrl = `${this.apiBase}/promos`;
        const response = await getOpen<Promo[]>(apiUrl);

        return response.data;
    }

    /**
     * Returns the status of the SpinShare Twitch stream.
     */
    async getStreamStatus(): Promise<StreamStatus> {
        const apiUrl = `${this.apiBase}/streamStatus`;
        const response = await getOpen<StreamStatus>(apiUrl);

        return response.data;
    }

    /**
     * Returns all active promos.
     */
    async getActivePromos(): Promise<Promo[]> {
        const apiUrl = `${this.apiBase}/activePromos`;
        const response = await getOpen<Promo[]>(apiUrl);

        return response.data;
    }

    /**
     * Returns more detailed information about a chart.
     * @param chartIdOrReference
     */
    async getChartDetail(chartIdOrReference: ChartIdOrReference): Promise<ChartDetail> {
        const apiUrl = `${this.apiBase}/song/${chartIdOrReference}`;
        const response = await getOpen<ChartDetail>(apiUrl);

        return response.data;
    }

    /**
     * Returns all active reviews of a song.
     * @param chartIdOrReference
     */
    async getChartReviews(chartIdOrReference: ChartIdOrReference): Promise<ChartReviews> {
        const apiUrl = `${this.apiBase}/song/${chartIdOrReference}/reviews`;
        const response = await getOpen<ChartReviews>(apiUrl);

        return response.data;
    }

    /**
     * Returns all active SpinPlays of a song.
     * @param chartIdOrReference
     */
    async getChartSpinPlays(chartIdOrReference: ChartIdOrReference): Promise<ChartSpinPlays> {
        const apiUrl = `${this.apiBase}/song/${chartIdOrReference}/spinplays`;
        const response = await getOpen<ChartSpinPlays>(apiUrl);

        return response.data;
    }

    /**
     * Returns all playlists that includes a chart.
     * @param chartIdOrReference
     */
    async getChartPlaylists(chartIdOrReference: ChartIdOrReference): Promise<PlaylistSummary[]> {
        const apiUrl = `${this.apiBase}/song/${chartIdOrReference}/playlists`;
        const response = await getOpen<PlaylistSummary[]>(apiUrl);

        return response.data;
    }

    /**
     * Generates a download zip and returns it. DLC charts require a hash of their DLC in the dlcHashes constructor option.
     * @param chartIdOrReference
     */
    async getChartDownload(chartIdOrReference: ChartIdOrReference): Promise<ArrayBuffer> {
        const apiUrl = `${this.apiBase}/song/${chartIdOrReference}/download`;
        const response = await axios.get<ArrayBuffer>(apiUrl, {
            responseType: 'arraybuffer',
            headers: this.dlcHashes.length > 0 ? { 'SPSH-DLC-Hash': this.dlcHashes.join(',') } : {},
            validateStatus,
        });

        // Errors are returned as JSON instead of a zip file
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('application/json')) {
            const jsonText = new TextDecoder('utf-8').decode(response.data);
            checkResponse({ status: response.status, data: JSON.parse(jsonText) });
            throw new ApiStatusError(`Expected a zip file, got a JSON response`);
        }
        if (response.status < 200 || response.status >= 300) {
            checkResponse({ status: response.status, data: undefined });
        }

        return response.data;
    }

    /**
     * Returns the current update hashes of multiple charts at once. Charts that can't be found are omitted.
     * @param chartIdsOrReferences - Up to 500 chart IDs and/or file references.
     */
    async getChartUpdateHashes(chartIdsOrReferences: ChartIdOrReference[]): Promise<ChartUpdateHash[]> {
        const apiUrl = `${this.apiBase}/updateHashes`;
        const response = await postOpen<ChartUpdateHash[]>(apiUrl, {
            charts: chartIdsOrReferences,
        });

        return response.data;
    }

    /**
     * Checks whether the given update hashes match the current versions of multiple charts.
     * @param charts - Up to 500 chart/updateHash pairs.
     */
    async checkChartUpdateHashes(charts: ChartUpdateHashCheck[]): Promise<ChartUpdateHashCheckResult[]> {
        const apiUrl = `${this.apiBase}/updateHashes/check`;
        const response = await postOpen<ChartUpdateHashCheckResult[]>(apiUrl, {
            charts,
        });

        return response.data;
    }

    /**
     * Returns more detailled information about a playlist.
     * @param playlistId
     */
    async getPlaylistDetail(playlistId: number): Promise<PlaylistDetail> {
        const apiUrl = `${this.apiBase}/playlist/${playlistId}`;
        const response = await getOpen<PlaylistDetail>(apiUrl);

        return response.data;
    }

    /**
     * Returns a general overview of information about a user.
     * @param userId
     */
    async getUserDetail(userId: number): Promise<UserDetail> {
        const apiUrl = `${this.apiBase}/user/${userId}`;
        const response = await getOpen<UserDetail>(apiUrl);

        return response.data;
    }

    /**
     * Returns all public charts of a user.
     * @param userId
     */
    async getUserCharts(userId: number): Promise<UserChart[]> {
        const apiUrl = `${this.apiBase}/user/${userId}/charts`;
        const response = await getOpen<UserChart[]>(apiUrl);

        return response.data;
    }

    /**
     * Returns all playlists of a user.
     * @param userId
     */
    async getUserPlaylists(userId: number): Promise<PlaylistSummary[]> {
        const apiUrl = `${this.apiBase}/user/${userId}/playlists`;
        const response = await getOpen<PlaylistSummary[]>(apiUrl);

        return response.data;
    }

    /**
     * Returns all reviews of a user.
     * @param userId
     */
    async getUserReviews(userId: number): Promise<Review[]> {
        const apiUrl = `${this.apiBase}/user/${userId}/reviews`;
        const response = await getOpen<Review[]>(apiUrl);

        return response.data;
    }

    /**
     * Returns all SpinPlays of a user.
     * @param userId
     */
    async getUserSpinPlays(userId: number): Promise<SpinPlay[]> {
        const apiUrl = `${this.apiBase}/user/${userId}/spinplays`;
        const response = await getOpen<SpinPlay[]>(apiUrl);

        return response.data;
    }

    /**
     * Returns the mappool of the current tournament.
     */
    async getTournamentMappool(): Promise<MappoolChart[]> {
        const apiUrl = `${this.apiBase}/tournament/mappool`;
        const response = await getOpen<MappoolChart[]>(apiUrl);

        return response.data;
    }

    /**
     * Returns a list of all DLCs
     */
    async getDlcs(): Promise<Dlc[]> {
        const apiUrl = `${this.apiBase}/dlc`;
        const response = await getOpen<Dlc[]>(apiUrl);

        return response.data;
    }

    /**
     * Returns the DLC of a DLC MD5 hash if it is valid or a 404 response if it is invalid
     * @param dlcHash
     */
    async verifyDlcHash(dlcHash: string): Promise<Dlc> {
        const apiUrl = `${this.apiBase}/dlc/verify/${dlcHash}`;
        const response = await getOpen<Dlc>(apiUrl);

        return response.data;
    }

    /**
     * Exchanges a connect code for a connect token. Requires the connectApiKey constructor option.
     * @param code - The connect code the user received.
     */
    async connectGetToken(code: string): Promise<string> {
        if (!this.connectApiKey) throw new ValidationError(
            `The connectApiKey option is required to get a connect token`
        )

        const apiUrl = `${this.apiBase}/connect/getToken`;
        const response = await getOpen<string>(apiUrl, {
            connectAppApiKey: this.connectApiKey,
            connectCode: code,
        });

        return response.data;
    }

    /**
     * Validates a connect token. Returns true if the token is valid, false if it is invalid.
     * @param token
     */
    async connectValidateToken(token: string): Promise<boolean> {
        const apiUrl = `${this.apiBase}/connect/validateToken`;

        try {
            await getConnect(apiUrl, token);
            return true;
        } catch(e) {
            if (e instanceof NotFoundError || e instanceof UnauthenticatedError) return false;
            throw e;
        }
    }

    /**
     * Returns the user's profile.
     * @param token
     */
    async connectGetProfile(token: string): Promise<ConnectProfile> {
        const apiUrl = `${this.apiBase}/connect/profile`;
        const response = await getConnect<ConnectProfile>(apiUrl, token);

        return response.data;
    }

    /**
     * Returns the user's charts.
     * @param token
     */
    async connectGetPlaylists(token: string): Promise<Playlist[]> {
        const apiUrl = `${this.apiBase}/connect/playlists`;
        const response = await getConnect<Playlist[]>(apiUrl, token);

        return response.data;
    }

    /**
     * Returns the user's notifications.
     * @param token
     */
    async connectGetNotifications(token: string): Promise<Notification[]> {
        const apiUrl = `${this.apiBase}/connect/notifications`;
        const response = await getConnect<Notification[]>(apiUrl, token);

        return response.data;
    }

    /**
     * Clears a notification.
     * @param token
     * @param notificationId
     */
    async connectClearNotification(token: string, notificationId: number): Promise<[]> {
        const apiUrl = `${this.apiBase}/connect/clearNotification`;
        const response = await getConnect<[]>(apiUrl, token, {
            notificationID: notificationId,
        });

        return response.data;
    }

    /**
     * Clears all notifications.
     * @param token
     */
    async connectClearAllNotifications(token: string): Promise<[]> {
        const apiUrl = `${this.apiBase}/connect/clearAllNotifications`;
        const response = await getConnect<[]>(apiUrl, token);

        return response.data;
    }

    /**
     * Returns the user's reviews.
     * @param token
     * @param chartId
     */
    async connectGetReview(token: string, chartId: number): Promise<Review> {
        const apiUrl = `${this.apiBase}/connect/reviews/${chartId}/get`;
        const response = await getConnect<Review>(apiUrl, token);

        return response.data;
    }

    /**
     * Adds a review.
     * @param token
     * @param chartId
     * @param recommended
     * @param comment
     */
    async connectAddReview(token: string, chartId: number, recommended: boolean, comment?: string): Promise<[]> {
        const apiUrl = `${this.apiBase}/connect/reviews/${chartId}/add`;
        const response = await postConnect<[]>(apiUrl, token, {
            recommended: !!recommended,
            comment: comment,
        });
        return response.data;
    }

    /**
     * Removes a review.
     * @param token
     * @param chartId
     */
    async connectRemoveReview(token: string, chartId: number): Promise<[]> {
        const apiUrl = `${this.apiBase}/connect/reviews/${chartId}/remove`;
        const response = await getConnect<[]>(apiUrl, token);

        return response.data;
    }
}

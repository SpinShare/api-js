import type {
    NOTIFICATION_TYPE_SYSTEM,
    NOTIFICATION_TYPE_NEWREVIEW,
    NOTIFICATION_TYPE_NEWSPINPLAY,
    NOTIFICATION_TYPE_RECEIVEDCARD,
} from "./constants.js";

/** A serialized PHP DateTime object, as returned by the API for all dates. */
export interface PhpDateTime {
    /** e.g. "2020-10-14 12:50:00.000000" */
    date: string;
    timezone_type: number;
    /** e.g. "Europe/Berlin" */
    timezone: string;
}

/** A numeric chart ID or a chart file reference (e.g. "spinshare_5fd014fe4afe7"). */
export type ChartIdOrReference = number | string;

export interface User {
    id: number;
    username: string;
    isVerified: boolean | null;
    isPatreon: boolean | null;
    pronouns: string | null;
    avatar: string;
}

export interface UserCard {
    id: number;
    icon: string;
    title: string;
    givenDate: PhpDateTime;
    description: string;
}

export interface Card {
    id: number;
    title: string;
    description: string;
    icon: string;
}

export interface UserDetail extends User {
    songs: number;
    playlists: number;
    reviews: number;
    spinplays: number;
    cards: UserCard[];
}

export interface ConnectProfile extends User {
    notificationsCount: number;
}

export interface Dlc {
    id: number;
    identifier: string;
    title: string;
    storeLink: string;
}

export interface Chart {
    id: number;
    title: string;
    subtitle: string | null;
    artist: string;
    charter: string;
    /** User ID of the uploader. */
    uploader: number;
    fileReference: string | null;
    tags: string[] | Record<string, string>;
    views: number | null;
    downloads: number | null;
    isExplicit: boolean | null;
    publicationStatus: number | null;
    hasEasyDifficulty: boolean;
    hasNormalDifficulty: boolean;
    hasHardDifficulty: boolean;
    hasExpertDifficulty: boolean;
    hasXDDifficulty: boolean;
    easyDifficulty: number | null;
    normalDifficulty: number | null;
    hardDifficulty: number | null;
    expertDifficulty: number | null;
    XDDifficulty: number | null;
    uploadDate: PhpDateTime;
    updateDate: PhpDateTime | null;
    updateHash: string | null;
    description: string | null;
    cover: string;
    dlc: Dlc | null;
}

export interface ChartPaths {
    ogg: string;
    cover: string;
    zip: string;
}

export interface ChartDetail extends Chart {
    paths: ChartPaths;
}

export interface SearchChart extends Chart {
    zip: string;
}

export interface MappoolChart extends Chart {
    srtbMD5: string | false;
    paths: ChartPaths;
}

export interface PlaylistChart extends Chart {
    zip: string;
    currentVersion: string | false;
}

export interface DiscoveryChart {
    id: number;
    title: string;
    subtitle: string | null;
    artist: string;
    charter: string;
    fileReference: string | null;
    isExplicit: boolean | null;
    hasEasyDifficulty: boolean;
    hasNormalDifficulty: boolean;
    hasHardDifficulty: boolean;
    hasExpertDifficulty: boolean;
    hasXDDifficulty: boolean;
    easyDifficulty: number | null;
    normalDifficulty: number | null;
    hardDifficulty: number | null;
    expertDifficulty: number | null;
    XDDifficulty: number | null;
    updateDate: PhpDateTime | null;
    updateHash: string | null;
    cover: string;
    zip: string;
}

export type UserChart = Omit<DiscoveryChart, "isExplicit"> & {
    uploader: number;
};

export interface Playlist {
    id: number;
    title: string;
    description: string | null;
    fileReference: string;
    user: User;
    songs: Chart[];
    isOfficial: boolean;
    cover: string;
}

export type PlaylistDetail = Omit<Playlist, "songs"> & {
    songs: PlaylistChart[];
};

export type PlaylistSummary = Omit<Playlist, "songs" | "description"> & {
    songs: number;
    description?: string | null;
};

export interface Review {
    id: number;
    song: Chart;
    user: User;
    recommended: boolean;
    comment: string | null;
    reviewDate: PhpDateTime;
}

export interface ChartReviews {
    /** Percentage of recommending reviews, or false if there aren't enough reviews. */
    average: number | false;
    /** Absent if the chart has no reviews. */
    reviews?: Review[];
}

export interface SpinPlay {
    id: number;
    user: User;
    videoUrl: string;
    videoThumbnail: string | null;
    submitDate: PhpDateTime;
    isActive: boolean;
}

/** An empty array if the chart has no SpinPlays. */
export type ChartSpinPlays = { spinPlays: SpinPlay[] } | [];

export interface Promo {
    id: number;
    title: string;
    type: string;
    textColor: string;
    color: string;
    button: {
        type: number;
        data: string;
    };
    isVisible: boolean;
    image_path: string;
}

export interface StreamStatus {
    title: string;
    viewers: number;
    isLive: boolean;
}

export type NotificationType =
    | typeof NOTIFICATION_TYPE_SYSTEM
    | typeof NOTIFICATION_TYPE_NEWREVIEW
    | typeof NOTIFICATION_TYPE_NEWSPINPLAY
    | typeof NOTIFICATION_TYPE_RECEIVEDCARD;

export interface Notification {
    id: number;
    user: User;
    notificationType: NotificationType;
    notificationData: string;
    connectedSong: Chart | null;
    connectedUser: User | null;
    connectedCard: Card | null;
}

export interface ChartUpdateHash {
    id: number;
    fileReference: string | null;
    updateHash: string | null;
}

export interface ChartUpdateHashCheck {
    chart: ChartIdOrReference;
    updateHash: string;
}

export interface ChartUpdateHashCheckResult {
    chart: ChartIdOrReference;
    isUpToDate: boolean;
}

export interface SearchChartsOptions {
    /** Whether to include charts with the "Easy" difficulty. Defaults to true. */
    diffEasy?: boolean;
    /** Whether to include charts with the "Normal" difficulty. Defaults to true. */
    diffNormal?: boolean;
    /** Whether to include charts with the "Hard" difficulty. Defaults to true. */
    diffHard?: boolean;
    /** Whether to include charts with the "Expert" difficulty. Defaults to true. */
    diffExpert?: boolean;
    /** Whether to include charts with the "XD" difficulty. Defaults to true. */
    diffXD?: boolean;
    /** The minimum rating value to filter the charts. Defaults to 0. */
    diffRatingFrom?: number;
    /** The maximum rating value to filter the charts. Defaults to 99; 0 is treated as 99. */
    diffRatingTo?: number;
    /** Whether to include explicit content in the results. Defaults to false. */
    showExplicit?: boolean;
}

export interface SpinShareClientOptions {
    /** Base URL of the API. Defaults to "https://spinsha.re/api". */
    apiBase?: string;
    /** MD5 hashes of owned DLCs, sent when downloading charts. */
    dlcHashes?: string[];
    /** API key of your connect app, required for connectGetToken. */
    connectApiKey?: string | null;
}

/** The response envelope every API endpoint wraps its data in. */
export interface ApiResponse<T> {
    version: number;
    status: number;
    data: T;
    pong?: boolean;
}

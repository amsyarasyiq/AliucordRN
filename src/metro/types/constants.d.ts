/* eslint-disable semi */
/* eslint @typescript-eslint/ban-types: 0 */
export default interface Constants {
    ADYEN_PAYMENT_SOURCES: Array<Array<number | string>>;
    APP_URL_PREFIX: string;
    AppRoutes: AppRoutes;
    BLOG_DOMAIN: string;
    BraintreeErrors: BraintreeErrors;
    ClientTypes: ClientTypes;
    Color: { [key: string]: string; };
    Colors: { [key: string]: string; };
    ColorsToCSSVariables: { [key: string]: string; };
    CurrencyCodes: { [key: string]: string; };
    DELAYED_PAYMENTS: number[];
    DiscoveryBannedSearchWords: string[];
    EMAIL_DOMAIN: string;
    ElevatedPermissions: string;
    ElevatedPermissionsList: string[];
    ExternalSKUStrategyTypes: ExternalSKUStrategyTypes;
    FEEDBACK_DOMAIN: string;
    FallbackCurrencyCountry: string;
    Fonts: Fonts;
    IRREDEEMABLE_PAYMENT_SOURCES: number[];
    Links: Links;
    LocalizedLinks: LocalizedLinks;
    MobilePaymentDefault: MobilePaymentDefault;
    NavigateEventSource: NavigateEventSource;
    OAuth2Scopes: OAuth2Scopes;
    PREPAID_PAYMENT_SOURCES: number[];
    PRIMARY_DOMAIN: string;
    PROACTIVE_FULFILLMENT: number[];
    PaymentGatewayToFriendlyName: { [key: string]: string; };
    PaymentGateways: PaymentGateways;
    PaymentSettings: PaymentSettings;
    PaymentSourceFlags: PaymentSourceFlags;
    PaymentSourceTypes: PaymentSourceTypes;
    PaymentStatusTypes: PaymentStatusTypes;
    Permissions: Permissions;
    PriceTierTypes: PriceTierTypes;
    RECAPTCHA_SITE_KEY: string;
    REDIRECTED_PAYMENT_SOURCES: number[];
    ROUGH_COUNT_MILLION_PLAYERS: number;
    RPCCloseCodes: RPCCloseCodes;
    RPCCommands: { [key: string]: string; };
    RPCEvents: RPCEvents;
    RPC_APPLICATION_LOGGING_CATEGORY: string;
    RPC_PORT_RANGE: number;
    RPC_STARTING_PORT: number;
    RPC_VERSION: number;
    RevenueSurfaces: RevenueSurfaces;
    RoleFlags: RoleFlags;
    SKUFeatureTypes: { [key: string]: number; };
    SKUGenres: { [key: string]: number; };
    SOCIAL_LINKS: SocialLinks;
    STATUS_DOMAIN: string;
    STATUS_PAGE_ENDPOINT: string;
    STRIPE_PAYMENT_SOURCES: Array<Array<number | string>>;
    SUPPORT_DEV_DOMAIN: string;
    SUPPORT_DOMAIN: string;
    StatusTypes: StatusTypes;
    SubscriptionTypes: SubscriptionTypes;
    TOKENS_KEY: string;
    TOKEN_KEY: string;
    ThemeColor: { [key: string]: string; };
    ThemeColorsToCSSVariables: { [key: string]: string; };
    ThemeTypes: ThemeTypes;
    UNSAFE_Colors: UNSAFEColors;
    UserMediaErrors: UserMediaErrors;
    VANITY_URL_PREFIX: string;
    VAULTABLE_PAYMENT_SOURCES: number[];
    WebAnalyticsEvents: WebAnalyticsEvents;
    WebAnalyticsPageLoads: WebAnalyticsPageLoads;
    WebColors: { [key: string]: string; };
    WebRoutes: { [key: string]: string; };
}

interface AppRoutes {
    WELCOME: string;
    ME: string;
    CHANGELOGS: string;
    LOGIN: string;
    REGISTER: string;
    CREATE_GUILD: string;
    HYPESQUAD_ONLINE: string;
    BROWSE_NITRO_TITLES: string;
}

interface BraintreeErrors {
    PAYPAL_POPUP_CLOSED: string;
    VENMO_APP_CANCELED: string;
    VENMO_CANCELED: string;
}

interface ClientTypes {
    DESKTOP: string;
    WEB: string;
    MOBILE: string;
    UNKNOWN: string;
}

interface ExternalSKUStrategyTypes {
    CONSTANT: number;
    APPLE_STICKER: number;
}

interface Fonts {
    PRIMARY_NORMAL: string;
    PRIMARY_MEDIUM: string;
    PRIMARY_SEMIBOLD: string;
    PRIMARY_BOLD: string;
    DISPLAY_NORMAL: string;
    DISPLAY_MEDIUM: string;
    DISPLAY_SEMIBOLD: string;
    DISPLAY_BOLD: string;
    DISPLAY_EXTRABOLD: string;
    CODE_SEMIBOLD: string;
}

interface Links {
    PRESSKIT: string;
    REBRAND_PRESSKIT: string;
    STATUS: string;
    HELP_AND_SUPPORT: string;
    FEEDBACK: string;
    EMAIL_SUPPORT: string;
    EMAIL_LAW_ENFORCEMENT: string;
    EMAIL_HYPESQUAD: string;
    DEV_PERKS_FORM: string;
    VERIFICATION_REQUIREMENTS: string;
    BASE_URL: string;
    PRESS_INQUIRIES: string;
    CONTACT_US: string;
    DEV_LANDING: string;
    DEV_PORTAL: string;
    DEV_PORTAL_APPLICATIONS: string;
    DEV_PORTAL_DOCUMENTATION: string;
    DEV_PORTAL_SELF_SERVE_MODAL: string;
    PARTNER_CODE_OF_CONDUCT: string;
    SUBMIT_TNS_REPORT: string;
    MERCH_STORE: string;
    MOD_ACADEMY_EXAM: string;
}

interface LocalizedLinks {
    TWITTER: Twitter;
}

interface Twitter {
    default: string;
    ja: string;
}

interface MobilePaymentDefault {
    COUNTRY: string;
    CURRENCY: string;
}

interface NavigateEventSource {
    SWIPE: string;
    BROWSER: string;
    KEYBIND: string;
}

interface OAuth2Scopes {
    IDENTIFY: string;
    EMAIL: string;
    CONNECTIONS: string;
    GUILDS: string;
    GUILDS_JOIN: string;
    GUILDS_MEMBERS_READ: string;
    GDM_JOIN: string;
    RPC: string;
    RPC_NOTIFICATIONS_READ: string;
    RPC_VOICE_READ: string;
    RPC_VOICE_WRITE: string;
    RPC_ACTIVITIES_WRITE: string;
    BOT: string;
    WEBHOOK_INCOMING: string;
    MESSAGES_READ: string;
    APPLICATIONS_BUILDS_UPLOAD: string;
    APPLICATIONS_BUILDS_READ: string;
    APPLICATIONS_COMMANDS: string;
    APPLICATIONS_COMMANDS_UPDATE: string;
    APPLICATIONS_COMMANDS_PERMISSIONS_UPDATE: string;
    APPLICATIONS_STORE_UPDATE: string;
    APPLICATIONS_ENTITLEMENTS: string;
    ACTIVITIES_READ: string;
    ACTIVITIES_WRITE: string;
    RELATIONSHIPS_READ: string;
    VOICE: string;
    DM_CHANNELS_READ: string;
    ROLE_CONNECTIONS_WRITE: string;
}

interface PaymentGateways {
    STRIPE: number;
    BRAINTREE: number;
    APPLE: number;
    GOOGLE: number;
    ADYEN: number;
    APPLE_PARTNER: number;
}

interface PaymentSettings {
    BRAINTREE: Braintree;
    STRIPE: Braintree;
}

interface Braintree {
    PAYMENT_GATEWAY: string;
}

interface PaymentSourceFlags {
    "1": string;
    NEW: number;
}

interface PaymentSourceTypes {
    "0": string;
    "1": string;
    "2": string;
    "3": string;
    "4": string;
    "5": string;
    "6": string;
    "7": string;
    "8": string;
    "9": string;
    "10": string;
    "11": string;
    "12": string;
    "13": string;
    "14": string;
    "15": string;
    "16": string;
    "99": string;
    UNKNOWN: number;
    CARD: number;
    PAYPAL: number;
    GIROPAY: number;
    SOFORT: number;
    PRZELEWY24: number;
    SEPA_DEBIT: number;
    PAYSAFE_CARD: number;
    GCASH: number;
    GRABPAY_MY: number;
    MOMO_WALLET: number;
    VENMO: number;
    GOPAY_WALLET: number;
    KAKAOPAY: number;
    BANCONTACT: number;
    EPS: number;
    IDEAL: number;
    PAYMENT_REQUEST: number;
}

interface PaymentStatusTypes {
    "0": string;
    "1": string;
    "2": string;
    "3": string;
    "4": string;
    "5": string;
    PENDING: number;
    COMPLETED: number;
    FAILED: number;
    REVERSED: number;
    REFUNDED: number;
    CANCELED: number;
}

interface Permissions {
    CREATE_INSTANT_INVITE: string;
    KICK_MEMBERS: string;
    BAN_MEMBERS: string;
    ADMINISTRATOR: string;
    MANAGE_CHANNELS: string;
    MANAGE_GUILD: string;
    CHANGE_NICKNAME: string;
    MANAGE_NICKNAMES: string;
    MANAGE_ROLES: string;
    MANAGE_WEBHOOKS: string;
    MANAGE_GUILD_EXPRESSIONS: string;
    VIEW_AUDIT_LOG: string;
    VIEW_CHANNEL: string;
    VIEW_GUILD_ANALYTICS: string;
    VIEW_CREATOR_MONETIZATION_ANALYTICS: string;
    MODERATE_MEMBERS: string;
    SEND_MESSAGES: string;
    SEND_TTS_MESSAGES: string;
    MANAGE_MESSAGES: string;
    EMBED_LINKS: string;
    ATTACH_FILES: string;
    READ_MESSAGE_HISTORY: string;
    MENTION_EVERYONE: string;
    USE_EXTERNAL_EMOJIS: string;
    ADD_REACTIONS: string;
    USE_APPLICATION_COMMANDS: string;
    MANAGE_THREADS: string;
    CREATE_PUBLIC_THREADS: string;
    CREATE_PRIVATE_THREADS: string;
    USE_EXTERNAL_STICKERS: string;
    SEND_MESSAGES_IN_THREADS: string;
    CONNECT: string;
    SPEAK: string;
    MUTE_MEMBERS: string;
    DEAFEN_MEMBERS: string;
    MOVE_MEMBERS: string;
    USE_VAD: string;
    PRIORITY_SPEAKER: string;
    STREAM: string;
    USE_EMBEDDED_ACTIVITIES: string;
    REQUEST_TO_SPEAK: string;
    MANAGE_EVENTS: string;
}

interface PriceTierTypes {
    "1": string;
    GUILD_ROLE_SUBSCRIPTIONS: number;
}

interface RPCCloseCodes {
    "1000": string;
    "1003": string;
    "1006": string;
    "4000": string;
    "4001": string;
    "4002": string;
    "4003": string;
    "4004": string;
    "4005": string;
    CLOSE_NORMAL: number;
    CLOSE_UNSUPPORTED: number;
    CLOSE_ABNORMAL: number;
    INVALID_CLIENTID: number;
    INVALID_ORIGIN: number;
    RATELIMITED: number;
    TOKEN_REVOKED: number;
    INVALID_VERSION: number;
    INVALID_ENCODING: number;
}

interface RPCEvents {
    CURRENT_USER_UPDATE: string;
    GUILD_STATUS: string;
    GUILD_CREATE: string;
    CHANNEL_CREATE: string;
    RELATIONSHIP_UPDATE: string;
    VOICE_CHANNEL_SELECT: string;
    VOICE_STATE_CREATE: string;
    VOICE_STATE_DELETE: string;
    VOICE_STATE_UPDATE: string;
    VOICE_SETTINGS_UPDATE: string;
    VOICE_SETTINGS_UPDATE_2: string;
    VOICE_CONNECTION_STATUS: string;
    SPEAKING_START: string;
    SPEAKING_STOP: string;
    GAME_JOIN: string;
    GAME_SPECTATE: string;
    ACTIVITY_JOIN: string;
    ACTIVITY_JOIN_REQUEST: string;
    ACTIVITY_SPECTATE: string;
    ACTIVITY_INVITE: string;
    ACTIVITY_PIP_MODE_UPDATE: string;
    THERMAL_STATE_UPDATE: string;
    ORIENTATION_UPDATE: string;
    NOTIFICATION_CREATE: string;
    MESSAGE_CREATE: string;
    MESSAGE_UPDATE: string;
    MESSAGE_DELETE: string;
    LOBBY_DELETE: string;
    LOBBY_UPDATE: string;
    LOBBY_MEMBER_CONNECT: string;
    LOBBY_MEMBER_DISCONNECT: string;
    LOBBY_MEMBER_UPDATE: string;
    LOBBY_MESSAGE: string;
    OVERLAY: string;
    OVERLAY_UPDATE: string;
    ENTITLEMENT_CREATE: string;
    ENTITLEMENT_DELETE: string;
    USER_ACHIEVEMENT_UPDATE: string;
    VOICE_CHANNEL_EFFECT_SEND: string;
    VOICE_CHANNEL_EFFECT_RECENT_EMOJI: string;
    VOICE_CHANNEL_EFFECT_TOGGLE_ANIMATION_TYPE: string;
    READY: string;
    ERROR: string;
}

interface RevenueSurfaces {
    "0": string;
    "1": string;
    DISCOVERY: number;
    CHECKOUT: number;
}

interface RoleFlags {
    IN_PROMPT: number;
}

interface SocialLinks {
    FACEBOOK_URL: string;
    INSTAGRAM_URL: string;
    YOUTUBE_URL: string;
}

interface StatusTypes {
    ONLINE: string;
    OFFLINE: string;
    IDLE: string;
    DND: string;
    INVISIBLE: string;
    STREAMING: string;
    UNKNOWN: string;
}

interface SubscriptionTypes {
    "1": string;
    "2": string;
    "3": string;
    PREMIUM: number;
    GUILD: number;
    APPLICATION: number;
}

interface ThemeTypes {
    DARK: string;
    LIGHT: string;
}

interface UNSAFEColors {
    HINT_PURPLE: string;
    DARK_PURPLE: string;
    MODAL_GREY: string;
    ORANGE: string;
    GUILDS_GREY: string;
    ACCOUNT_GREY: string;
    CHAT_GREY: string;
    UNREAD_GREY: string;
    HIGHLIGHT_GREY: string;
    AVATAR_GREY: string;
    WHITE2: string;
    WHITE3: string;
    WHITE7: string;
    WHITE8: string;
    GREY1: string;
    GREY2: string;
    GREY3: string;
    GREY4: string;
    GREY5: string;
    GREY6: string;
    GREY7: string;
    GREY9: string;
}

interface UserMediaErrors {
    PERMISSION_DENIED: string;
    PERMISSION_DISMISSED: string;
    NO_DEVICES_FOUND: string;
}

interface WebAnalyticsEvents {
    EXPERIMENT_USER_TRIGGERED: string;
    EXPERIMENT_GUILD_TRIGGERED: string;
    MKTG_PAGE_VIEWED: string;
    CLICK_LANDING_CTA: string;
    DOWNLOAD_APP: string;
    MKTG_HYPESQUAD_FORM_SUBMITTED: string;
    MKTG_HYPESQUAD_FORM_OPENED: string;
    CHANGE_MARKETING_LOCALE: string;
    GAME_CLICKED_LANDING: string;
    MAIN_NAVIGATION_MENU: string;
    MKTG_APPLICATION_STEP: string;
    MKTG_WARFRAME_CTA_CLICKED: string;
    MKTG_PAGE_CTA_CLICKED: string;
    MKTG_VIDEO_PLAYED: string;
    DEEP_LINK_CLICKED: string;
    SEO_PAGE_VIEWED: string;
    SEO_PAGE_CTA_CLICKED: string;
    SEO_AGGREGATOR_PAGE_VIEWED: string;
    SEO_AGGREGATOR_CTA_CLICKED: string;
    LOCATION_STACK_METADATA: string;
    CREATOR_STORE_PAGE_VIEWED: string;
    CREATOR_STORE_PAGE_CTA_CLICKED: string;
}

interface WebAnalyticsPageLoads {
    MKTG_ACKNOWLEDGEMENTS_MODAL_OPEN: string;
}

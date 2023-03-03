import type { EmitterSubscription, ImageSourcePropType, ImageStyle, TextStyle, ViewStyle } from "react-native";
import { getByName, getByProps, getByStoreName, getModule } from "./filters";

export const UserStore = getByStoreName("UserStore");
export const GuildStore = getByStoreName("GuildStore");
export const ThemeStore = getByStoreName("ThemeStore");
export const ChannelStore = getByStoreName("ChannelStore");
export const MessageStore = getByStoreName("MessageStore");
export const GuildMemberStore = getByStoreName("GuildMemberStore");
export const SelectedChannelStore = getByStoreName("SelectedChannelStore");
export const UnsyncedUserSettingsStore = getByStoreName("UnsyncedUserSettingsStore");
export const SearchStore = getByProps("useDiscoveryState", "useQueryState");

export const ModalActions = getByProps("closeModal");
export const MessageActions = getByProps("sendMessage", "receiveMessage");
export const FluxDispatcher = getByProps("subscribe", "isDispatching");
export const FetchUserActions = getByProps("getUser", "fetchProfile");
export const ContextMenuActions = getByProps("openContextMenu");
export const SnowflakeUtils = getByProps("fromTimestamp", "extractTimestamp");
export const Locale = getByProps("Messages");
export const AMOLEDThemeManager = getByProps("setAMOLEDThemeEnabled");
export const Users = getByProps("getCurrentUser");
export const Profiles = getByProps("showUserProfile");

export const Clipboard = getByProps("getString", "setString", "hasString") as {
    getString(): Promise<string>,
    setString(str: string): Promise<void>,
    hasString(): Promise<boolean>,
    getImage(): Promise<string>,
    addListener(callback: () => void): EmitterSubscription,
    removeAllListeners(): void;
};

export const Dialog = getByProps("show", "openLazy", "confirm", "close") as {
    show(options: {
        title?: string,
        body?: string,
        confirmText?: string,
        cancelText?: string,
        confirmColor?: string,
        isDismissable?: boolean,
        onConfirm?: () => any,
        onCancel?: () => any,
        [k: PropertyKey]: any;
    }),
    close(),
    [k: PropertyKey]: any;
};

export const Toasts = getModule(m => (
    m.open !== undefined && m.close !== undefined && !m.openLazy && !m.startDrag && !m.init && !m.openReplay && !m.openChannelCallPopout
)) as {
    open(options: {
        content?: string,
        source?: ImageSourcePropType,
        [k: PropertyKey]: any;
    }),
    close(),
    [k: PropertyKey]: any;
};

export const React = getByProps("createElement") as typeof import("react");
export const ReactNative = getByProps("View") as typeof import("react-native");

export const RestAPI = getByProps("getAPIBaseURL", "get");
export const Flux = getByProps("connectStores");
export const Constants = getByProps("Fonts") as import("./types/constants").default;
export const URLOpener = getByProps("openURL", "handleSupportedURL");
export const Forms = getByProps("FormSection");
export const Scenes = getByName("getScreens", { default: false });
export const ThemeManager = getByProps("updateTheme", "overrideTheme");
export const AssetRegistry = getByProps("registerAsset");
export const SemVer = getByProps("SemVer");

export const ColorMap = getByProps("unsafe_rawColors");
export const SemanticColors = getByProps("unsafe_rawColors").colors;
export const RawColors = getByProps("unsafe_rawColors").unsafe_rawColors;

export const Navigation = getByProps("pushLazy");
export const NavigationStack = getByProps("createStackNavigator");
export const NavigationNative = getByProps("NavigationContainer");
export const DiscordNavigator = getByName("Navigator", { default: false });

// Abandon all hope, ye who enter here
type Style = ViewStyle & ImageStyle & TextStyle;
type Styles = Partial<{ [key in keyof Style]: readonly [Style[key], Style[key]] | Style[key] }>;
type FlattenValue<T> = { [key in keyof T]: T[key] extends ReadonlyArray<infer E> ? E : T[key] };

export const Styles = getByProps("createThemedStyleSheet") as {
    ThemeColorMap: Record<string, [string, string]>;
    createThemedStyleSheet: <T extends { [key: string]: Styles; }>(styles: T)
        => { [key in keyof T]: FlattenValue<T[key]>; };
    getThemedStylesheet: <T extends { [key: string]: Styles; }>(styles: T)
        => Record<"mergedDarkStyles" | "mergedLightStyles", { [key in keyof T]: FlattenValue<T[key]>; }>;
};

export { getByProps };


import { logger } from "../Aliucord";
import { AMOLEDThemeManager, Constants, FluxDispatcher, ThemeManager, ThemeStore } from "../metro";
import { patcher } from "../utils";

export default function patchTheme() {
    logger.info("Patching theme...");

    try {
        enableCustomTheme();

        // Can't figure out where the AMOLED theme toggle is stored, so we'll just store it in Aliucord's settings
        if (AMOLEDThemeManager) {
            if (window.Aliucord.settings.get("enableAMOLEDTheme", false)) {
                AMOLEDThemeManager.enableAMOLEDThemeOption();
                logger.info("Enabled AMOLED theme");
            }

            patcher.before(AMOLEDThemeManager, "setAMOLEDThemeEnabled", (_, enabled) => {
                logger.info(`Setting AMOLED theme to ${enabled}`);
                window.Aliucord.settings.set("enableAMOLEDTheme", enabled);
            });
        } else {
            logger.error("Could not get AMOLEDThemeManager");
        }

        // 'I18N_LOAD_START' dispatch is the best time I can find to override the theme without breaking it.
        // Therefore, there's no guarantee that this will fix it for everyone
        if (ThemeStore) {
            const overrideTheme = () => {
                if (ThemeStore.theme === "light") {
                    AMOLEDThemeManager.enableAMOLEDThemeOption();
                }

                ThemeManager.overrideTheme(ThemeStore.theme ?? "dark");
                logger.info(`Overrode theme to ${ThemeStore.theme ?? "dark"}`);
                FluxDispatcher.unsubscribe("I18N_LOAD_START", overrideTheme);
            };

            FluxDispatcher.subscribe("I18N_LOAD_START", overrideTheme);
        } else {
            logger.error("Could not get ThemeStore");
        }
    } catch (err) {
        logger.error("Failed to patch theme", err);
    }
}

function enableCustomTheme() {
    const newTcm = {
        "HEADER_PRIMARY": [
            "#e792c1",
            "#060607"
        ],
        "HEADER_SECONDARY": [
            "#fefffe",
            "#4f5660"
        ],
        "TEXT_NORMAL": [
            "#FBFBFB",
            "#2e3338"
        ],
        "TEXT_MUTED": [
            "#e792c1",
            "#747f8d"
        ],
        "INTERACTIVE_NORMAL": [
            "#fefffe",
            "#4f5660"
        ],
        "INTERACTIVE_HOVER": [
            "#dcddde",
            "#2e3338"
        ],
        "INTERACTIVE_ACTIVE": [
            "#95a7fd",
            "#060607"
        ],
        "INTERACTIVE_MUTED": [
            "#697eab",
            "#c7ccd1"
        ],
        "CHAT_BACKGROUND": [
            "#212027",
            "#123456"
        ],
        "BACKGROUND_PRIMARY": [
            "#24232b",
            "#123456"
        ],
        "BACKGROUND_SECONDARY": [
            "#24232b",
            "#f2f3f5"
        ],
        "BACKGROUND_SECONDARY_ALT": [
            "#24232b",
            "#ebedef"
        ],
        "BACKGROUND_TERTIARY": [
            "#212028",
            "#e3e5e8"
        ],
        "BACKGROUND_ACCENT": [
            "#95a7fd",
            "#747f8d"
        ],
        "BACKGROUND_FLOATING": [
            "#1b1a25",
            "#FFFFFF"
        ],
        "BACKGROUND_MOBILE_PRIMARY": [
            "#1b1a25",
            "#f8f9f9"
        ],
        "BACKGROUND_MOBILE_SECONDARY": [
            "#24232b",
            "#ffffff"
        ],
        "BACKGROUND_NESTED_FLOATING": [
            "#24232b",
            "#ffffff"
        ],
        "BACKGROUND_MESSAGE_HOVER": [
            "rgba(255, 255, 255, 0.02)",
            "#FFFFFF"
        ],
        "BACKGROUND_MODIFIER_HOVER": [
            "rgba(255, 255, 255, 0.02)",
            "hsla(214, 9.9%, 50.4%, 0.08)"
        ],
        "BACKGROUND_MODIFIER_ACTIVE": [
            "rgba(255, 255, 255, 0.03)",
            "hsla(214, 9.9%, 50.4%, 0.16)"
        ],
        "BACKGROUND_MODIFIER_SELECTED": [
            "rgba(255, 255, 255, 0.04)",
            "hsla(214, 9.9%, 50.4%, 0.24)"
        ],
        "BACKGROUND_MODIFIER_ACCENT": [
            "transparent",
            "hsla(240, 7.7%, 2.5%, 0.08)"
        ],
        "SCROLLBAR_THIN_THUMB": [
            "#2a1858",
            "hsla(217, 7.6%, 33.5%, 0.3)"
        ],
        "SCROLLBAR_THIN_TRACK": [
            "transparent",
            "hsla(0, 0%, 0%, 0)"
        ],
        "SCROLLBAR_AUTO_THUMB": [
            "#2a1858",
            "#cccccc"
        ],
        "SCROLLBAR_AUTO_TRACK": [
            "rgba(0, 0, 0, 0.1)",
            "#f2f2f2"
        ],
        "CHANNELTEXTAREA_BACKGROUND": [
            "#111111",
            "#ebedef"
        ],
        "CHANNELS_DEFAULT": [
            "#b6b6b6",
            "#6a7480"
        ],
        "TEXT_LINK": [
            "#95a7fd",
            "#000000"
        ],
        "ANDROID_NAVIGATION_BAR_BACKGROUND": [
            "#24232b",
            "#f2f3f5"
        ]
    };

    const newColors = {
        "PRIMARY_DARK": "#747474",
        "PRIMARY_DARK_100": "#FFFFFF",
        "PRIMARY_DARK_200": "#FFFFFF",
        "PRIMARY_DARK_300": "#fefffe",
        "PRIMARY_DARK_360": "#fcfdfc",
        "PRIMARY_DARK_400": "#bebee3",
        "PRIMARY_DARK_500": "#697eab",
        "PRIMARY_DARK_600": "#212027",
        "PRIMARY_DARK_630": "#343843",
        "PRIMARY_DARK_700": "#1a1b21",
        "PRIMARY_DARK_800": "#212027",
        "BRAND_NEW": "#86a2de",
        "STATUS_RED": "#c18ea4",
        "STATUS_GREEN_600": "#87a2de",
        "STATUS_YELLOW": "#c18ea4"
    };

    window.AliuHermes.unfreeze(Constants.ThemeColorMap);
    window.AliuHermes.unfreeze(Constants.Colors);
    window.AliuHermes.unfreeze(Constants.UNSAFE_Colors);

    for (const key in Constants.ThemeColorMap) {
        if (newTcm[key]) {
            Constants.ThemeColorMap[key][2] = newTcm[key]?.[0];
            Constants.ThemeColorMap[key][1] = newTcm[key]?.[1];
            logger.info("Patched theme color", key);
        }
    }

    for (const key in newColors) {
        Constants.Colors[key] = newColors[key];
    }
}

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
    // theme credit: https://raw.githubusercontent.com/Joksy/Joksy-Enmity/main/Joksys-Theme-V1/Joksys.json
    const newTcm = {
        "BACKGROUND_PRIMARY": ["#141a2e", "#141a2e"],
        "BACKGROUND_SECONDARY": ["#212133", "#212133"],
        "BACKGROUND_SECONDARY_ALT": ["#2d2d54", "#2d2d54"],
        "BACKGROUND_TERTIARY": ["#0c121c", "#0c121c"],
        "BACKGROUND_ACCENT": ["#1d2540", "#1d2540"],
        "BACKGROUND_FLOATING": ["#121721", "#121721"],
        "BACKGROUND_MOBILE_PRIMARY": ["#141a2e", "#141a2e"],
        "BACKGROUND_MOBILE_SECONDARY": ["#141a2e", "#141a2e"],
        "BACKGROUND_MODIFIER_ACTIVE": ["#0c101c", "#0c101c"],
        "BACKGROUND_MODIFIER_SELECTED": ["#0c101c", "#0c101c"],
        "BACKGROUND_NESTED_FLOATING": ["#212133", "#212133"],
        "CHANNELS_DEFAULT": ["#c2c2c2", "#c2c2c2"],
        "CHAT_BACKGROUND": ["#141a2e", "#141a2e"],
        "HEADER_PRIMARY": ["#ffffff", "#ffffff"],
        "HEADER_SECONDARY": ["#c2c2c2", "#c2c2c2"],
        "INTERACTIVE_ACTIVE": ["#ffffff", "#FFFFFF"],
        "INTERACTIVE_NORMAL": ["#d0d1d4", "#d0d1d4"],
        "TEXT_MUTED": ["#c2c2c2", "#c2c2c2"],
        "TEXT_NORMAL": ["#ffffff", "#FFFFFF"]
    };

    const newColors = {
        "PRIMARY_DARK": "#1F2125",
        "PRIMARY_DARK_100": "#C2C2C2",
        "PRIMARY_DARK_300": "#c2c2c2",
        "PRIMARY_DARK_360": "#FFFFFF",
        "PRIMARY_DARK_400": "#282C37",
        "PRIMARY_DARK_500": "#1F2125",
        "PRIMARY_DARK_600": "#1F2125",
        "PRIMARY_DARK_630": "#1F2125",
        "PRIMARY_DARK_700": "#14161A",
        "PRIMARY_DARK_800": "#14161A",
        "BRAND_NEW": "#7288DA",
        "WHITE": "#FFFFFF"
    };

    window.AliuHermes.unfreeze(Constants.ThemeColorMap);
    window.AliuHermes.unfreeze(Constants.Colors);
    window.AliuHermes.unfreeze(Constants.UNSAFE_Colors);

    for (const key in Constants.ThemeColorMap) {
        Constants.ThemeColorMap[key][2] = Constants.ThemeColorMap[key][0];
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

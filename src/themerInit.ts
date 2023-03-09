import { Theme } from "./entities";

export enum ThemeErrors {
    NO_SETTINGS = "Themes are loaded, but settings wasn't found",
    UNKNOWN_THEME = "Unknown theme applied, reverting to default",
    UNEXPECTED_ERROR = "Unexpected error",
    THEME_UNSET = "Theme is unset",
    NO_THEME_DIRECTORY = "Theme directory not found",
    MODULES_NOT_FOUND = "Modules needed was not found"
}

type Resolver = {
    css: string;
    spring: (...opt) => string | any;
    hsl: (...opt) => string | any;
};

let RawColor: { [key: PropertyKey]: string; };
let SemanticColor: { [key: PropertyKey]: { [key: PropertyKey]: { raw: symbol; opacity: number; }; }; };

let ColorMap: {
    colors: { [key: PropertyKey]: { [sym: symbol]: string; }; };
    unsafe_rawColors: { [key: PropertyKey]: string; };
    themes: { [key: PropertyKey]: string; };
    meta: {
        isSemanticColor: () => boolean,
        resolveSemanticColor: (theme: string, color: { [key: symbol]: string; }) => string;
    };
};

let ColorResolvers: {
    colors: {
        [key: PropertyKey]: {
            css: string,
            resolve: (...opt) => Resolver;
        };
    };
    themes: { [key: PropertyKey]: string; };
    unsafe_rawColors: {
        [key: PropertyKey]: Resolver;
    };
};

const { externalStorageDirectory } = window.nativeModuleProxy.AliucordNative;
const SETTINGS_DIRECTORY = externalStorageDirectory + "/AliucordRN/settings/";
const THEME_DIRECTORY = externalStorageDirectory + "/AliucordRN/themes/";

export const excludedThemes = {
    invalidThemes: [] as InvalidTheme[],
    duplicatedThemes: [] as string[]
};

export type InvalidTheme = {
    name: string;
    reason: string;
};

// These are handled after Aliucord loads
export let themeState = {} as {
    isApplied: true;
    currentTheme: string;
    noAMOLED: boolean;
} | {
    isApplied: false;
    anError: boolean;
    currentTheme?: string;
    reason?: ThemeErrors;
    errorArgs?: any[];
};

export const loadedThemes: Theme[] = [];

export function themerInit(colorMapper) {
    if (colorMapper.default?.meta) {
        SemanticColor = colorMapper.SemanticColor;
        RawColor = colorMapper.RawColor;
        ColorMap = colorMapper.default;
    } else {
        ColorResolvers = colorMapper.default;
    }

    console.log("Themer init", colorMapper);
    ColorMap && ColorResolvers && handleThemeApply();
}

function handleThemeApply() {
    try {
        if (!loadThemes()) return;
        const themeName = getTheme();

        // File doesn't exist or theme isn't set
        if (!themeName) return;

        const theme: Theme = loadedThemes[themeName];
        if (!theme) {
            themeState = {
                isApplied: false,
                currentTheme: themeName,
                anError: true,
                reason: ThemeErrors.UNKNOWN_THEME
            };
            return;
        }

        theme.colors ??= theme.colours;

        // so it works like old behaviour
        // for (const key in DiscordColorMap.SemanticColor) {
        //     const obj = DiscordColorMap.SemanticColor[key];
        //     if (!obj) continue;

        //     for (const index in obj) {
        //         const themeSymbol = Symbol() as symbol;
        //         const original = DiscordColorMap.RawColor[obj[index].raw];

        //         DiscordColorMap.RawColor[themeSymbol] = original;
        //         obj[index].raw = themeSymbol;
        //     }
        // }

        // Temporary, Discord hasn't use it yet
        // It will certainly break in the future
        const fakeResolver = {
            css: "This was faked!",
            spring: () => "#000000",
            hsl: () => "#000000"
        } as Resolver;

        // Just so it behaves like old behaviour
        for (const key in SemanticColor) {
            const obj = SemanticColor[key];

            ColorResolvers.colors[key].resolve = () => fakeResolver;

            for (const index in obj) {
                const original = RawColor[obj[index].raw];
                const themeSymbol = Symbol(original) as symbol;

                obj[index].raw = themeSymbol;
                RawColor[themeSymbol] = original;
            }
        }

        if (theme.colors) {
            for (const key in theme.colors) {
                RawColor[key] = theme.colors[key];
            }
        }

        if (theme.theme_color_map) {
            const map = ["dark", "light", "amoled"];

            theme.theme_color_map["CHAT_BACKGROUND"] ??= theme.theme_color_map["BACKGROUND_PRIMARY"];

            for (const key in theme.theme_color_map) {
                if (!SemanticColor[key]) continue;

                for (const index in theme.theme_color_map[key]) {
                    const color = theme.theme_color_map[key][index];
                    if (!color) continue;

                    const themeSymbol = Symbol(key) as symbol;

                    Object.defineProperty(RawColor, themeSymbol, {
                        value: color,
                        enumerable: false
                    });

                    SemanticColor[key][map[index]] = {
                        raw: themeSymbol,
                        opacity: 1
                    };
                }
            }
        }

        themeState = {
            currentTheme: themeName,
            isApplied: true,
            // Check if AMOLED is not supported. If so, automatically turn off AMOLED.
            noAMOLED: !!theme.theme_color_map && !Object.values(theme.theme_color_map)[0][2]
        };
    } catch (error) {
        console.error(error);
        // themeState = {
        //     isApplied: false,
        //     anError: true,
        //     reason: ThemeErrors.UNEXPECTED_ERROR,
        //     errorArgs: [error]
        // };
    }
}

function getTheme(): string | null {
    // Check if Aliucord.json file exists in settings directory
    if (!AliuFS.exists(SETTINGS_DIRECTORY + "Aliucord.json")) {
        themeState = {
            isApplied: false,
            anError: false,
            reason: ThemeErrors.NO_SETTINGS,
        };
        return null;
    }

    // Read the settings file
    const content = AliuFS.readFile(SETTINGS_DIRECTORY + "Aliucord.json", "text");
    const json = JSON.parse(content as string);

    // Check if theme is enabled
    if (!json.theme) {
        themeState = {
            isApplied: false,
            anError: false,
            reason: ThemeErrors.THEME_UNSET
        };
        return null;
    }

    return json.theme;
}

function loadThemes(): boolean {
    // Check if themes directory exists
    if (!AliuFS.exists(THEME_DIRECTORY)) {
        themeState = {
            isApplied: false,
            anError: false,
            reason: ThemeErrors.NO_THEME_DIRECTORY
        };
        return false;
    }

    for (const file of AliuFS.readdir(THEME_DIRECTORY)) {
        // Check if file is a json file
        if (!file.name.endsWith(".json")) continue;

        // Read the file
        const content = AliuFS.readFile(THEME_DIRECTORY + file.name, "text");

        let json: Theme;
        try {
            json = JSON.parse(content as string);
        } catch (error) {
            excludedThemes.invalidThemes.push({
                name: file.name,
                reason: "File is not in a valid JSON format, please re-check."
            });

            continue;
        }

        // Check if file is a valid theme
        if (!json.name || (!json.theme_color_map && !json.colors && !json.colours)) {
            if (json["manifest"] && json["simple_colors"]) {
                excludedThemes.invalidThemes.push({
                    name: json["manifest"]?.["name"] ?? file.name,
                    reason: "Possibly a legacy theme. Please note that legacy themes are not supported in the new version."
                });
                continue;
            }

            excludedThemes.invalidThemes.push({
                name: file.name,
                reason: "Theme is not in a valid theme format; theme must have a name and at least has a 'theme_color_map' or 'colors' key."
            });
            continue;
        } else if (loadedThemes[json.name]) {
            excludedThemes.duplicatedThemes.push(json.name);
            continue;
        }

        // Add theme to loaded themes
        loadedThemes[json.name] = json;
    }

    return true;
}

// returns a 0xRRGGBBAA 32bit int
// function normalizeColor(color: string): number {
//     const processed = Number(window.ReactNative.processColor(color));
//     return ((processed & 0x00ffffff) << 8 | processed >>> 24) >>> 0;
// }

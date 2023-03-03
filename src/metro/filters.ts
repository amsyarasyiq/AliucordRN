import { themerInit } from "../themerInit";

declare const __r: (moduleId: number) => any;
declare const modules: { [id: number]: any; };

// Blacklists bad modules from module search
function blacklist(id: number) {
    Object.defineProperty(modules, id, {
        value: modules[id],
        enumerable: false,
        configurable: true,
        writable: true
    });
}

// Checks if a module has a specific property and return the exports
function withProp(module: any, prop: string) {
    return (
        module?.isInitialized
        && module.publicModule.exports?.[prop] !== undefined
        && module.publicModule.exports
        || undefined
    );
}

for (const key in modules) {
    const id = Number(key);
    const module = modules[id];

    if (module.isInitialized) {
        if (module.publicModule.exports === window.nativeModuleProxy) {
            blacklist(id);
            continue;
        }

        window.React ??= withProp(module, "createElement");
        window.ReactNative ??= withProp(module, "View");

        // Themer has to be initialized very early before Discord requiring its colors
        if (withProp(module, "SemanticColor")) {
            themerInit(module.publicModule.exports);
        }
    }

    if (module.factory) {
        const strings = AliuHermes.findStrings(module.factory);

        // Blacklist momentjs locale modules which change the language as a side effect
        if (strings.length === 8 && strings[6] === "moment") {
            blacklist(id);
            continue;
        }
    }
}

/**
 * Module filter options
 */
type FilterOptions = {
    exports?: boolean;
    default?: false;
} | {
    exports?: true;
    default?: true;
};

/**
 * Find a Discord Module
 * @param filter Module filter
 * @param options Options.
 * @returns Module if found, else null
 */
export function getModule(filter: (module: any) => boolean, options?: FilterOptions) {
    const { exports = true, default: defaultExport = true } = options ?? {};

    for (const key in modules) {
        const id = Number(key);

        let mod;
        try {
            mod = __r(id);
        } catch {
            // Some modules throw error, ignore
        }
        if (!mod) continue;

        try {
            if (filter(mod)) {
                const module = modules[id].publicModule;
                return exports ? module.exports : module;
            }

            if (mod.default && filter(mod.default)) {
                const module = modules[id].publicModule;
                return defaultExport ? module.exports.default :
                    exports ? module.exports : module;
            }
        } catch (e: any) {
            (console).error("Error during getModule", e?.stack ?? e);
        }
    }

    return null;
}

type PropIntellisense<P extends string> = Record<P, any> & Record<PropertyKey, any>;

/**
 * Find a module by props
 * @param props One or more props
 */
export function getByProps<T extends string>(...props: T[]): PropIntellisense<T>;
export function getByProps<T extends string>(...options: [...props: T[], options: FilterOptions]): PropIntellisense<T>;
export function getByProps<T extends string>(...options: [...props: T[], defaultExport: boolean]): PropIntellisense<T>;
export function getByProps(...props: any[]) {
    if (!props.length) return null;

    const options = typeof props[props.length - 1] === "object" ? props.pop() : {};
    const filter = (module: any) => {
        for (let i = 0, len = props.length; i < len; i++)
            if (module[props[i]] === undefined) return false;
        return true;
    };

    return getModule(filter, typeof options === "boolean" ? { default: options } : options);
}

/**
 * Find a module by its displayName property. Usually useful for finding React Components
 * @returns Module if found, else null
 */
export function getByDisplayName(displayName: string, options?: FilterOptions) {
    return getModule(m => m.displayName === displayName, options);
}

/**
 * Find a module by its default.name property. Usually useful for finding React Components
 * @returns Module if found, else null
 */
export function getByName(defaultName: string, options?: FilterOptions) {
    return getModule(m => m?.default?.name === defaultName, options);
}

/**
 * Find a Store by its name. 
 * @returns Module if found, else null
 */
export function getByStoreName(storeName: string, options?: FilterOptions) {
    return getModule(m => m.getName?.() === storeName, options);
}

/**
 * Get a module by its numeric id. Unless you know what you're doing, you
 * should not use this.
 */
export const getById = __r;

/**
 * Same as getModule, but retrieves all matches instead of the first
 * @returns Array of modules
 */
export function getAll(filter: (module: any) => boolean, options?: FilterOptions): any[] {
    const { exports = true, default: defaultExport = true } = options ?? {};

    const ret = [] as any[];
    for (const key in modules) {
        const id = Number(key);

        let mod;
        try {
            mod = __r(id);
        } catch {
            // Some modules throw error, ignore
        }

        if (!mod) continue;

        try {
            if (filter(mod)) {
                const module = modules[Number(id)].publicModule;
                ret.push(exports ? module.exports : module);
            }

            if (mod.default && filter(mod.default)) {
                const module = modules[Number(id)].publicModule;
                return defaultExport ? module.exports.default :
                    exports ? module.exports : module;
            }
        } catch (e: any) {
            (console).error("Error during getModule", e?.stack ?? e);
        }
    }

    return ret;
}

/**
 * Same as getByProps, but retrieves all matches instead of the first
 * @returns Array of modules
 */
export function getAllByProps<T extends string>(...props: T[]): PropIntellisense<T>[];
export function getAllByProps<T extends string>(...options: [...props: T[], options: FilterOptions]): PropIntellisense<T>[];
export function getAllByProps<T extends string>(...options: [...props: T[], defaultExport: boolean]): PropIntellisense<T>[];
export function getAllByProps(...props: any[]) {
    if (!props.length) return [];

    const options = typeof props[props.length - 1] === "object" ? props.pop() : {};
    const filter = (module: any) => {
        for (let i = 0, len = props.length; i < len; i++)
            if (module[props[i]] === undefined) return false;
        return true;
    };

    return getAll(filter, typeof options === "boolean" ? { default: options } : options);
}

/**
 * Find all modules with properties containing the specified keyword 
 * @param keyword They keyword
 * @param skipConstants Whether constants (names that are FULL_CAPS) should be skipped. Defaults to true
 * @returns Array of names that match. You can then access moduleSearchResults.SomeName to view the
 *          corresponding module 
 */
export function searchByKeyword(keyword: string, skipConstants = true) {
    keyword = keyword.toLowerCase();
    const matches = [] as string[];
    window.moduleSearchResults = {};

    function check(obj: any) {
        if (!obj) return;
        for (const name of Object.getOwnPropertyNames(obj)) {
            if (name.toLowerCase().includes(keyword) && (!skipConstants || name.toUpperCase() !== name)) {
                matches.push(name);
                window.moduleSearchResults[name] = obj;
            }
        }
    }

    for (const id in modules) {
        try {
            __r(Number(id));
            const mod = modules[id]?.publicModule;
            if (mod) {
                check(mod);
                check(mod.exports);
                check(mod.exports?.default);
            }
        } catch {
            //
        }
    }

    return matches;
}

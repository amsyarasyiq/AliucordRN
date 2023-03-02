import { version } from "../Aliucord";
import { ApplicationCommandOptionType, plugins } from "../api";
import { Plugin } from "../entities";
import { getByProps } from "../metro";
import { Locale, MessageActions } from "../metro/common";
import { makeAsyncEval } from "../utils";
import { ALIUCORD_DIRECTORY } from "../utils/constants";
import { DebugInfo } from "../utils/debug";

const customBundle = AliuFS.exists(ALIUCORD_DIRECTORY + "Aliucord.js.bundle");

export default class CoreCommands extends Plugin {
    start() {
        const ClydeUtils = getByProps("sendBotMessage");
        this.commands.registerCommand({
            name: "echo",
            description: "Creates a Clyde message",
            options: [
                {
                    name: "message",
                    description: Locale.Messages.COMMAND_SHRUG_MESSAGE_DESCRIPTION,
                    required: true,
                    type: ApplicationCommandOptionType.STRING
                }
            ],
            execute: (args, ctx) => {
                ClydeUtils.sendBotMessage(ctx.channel.id, args[0].value);
            }
        });

        this.commands.registerCommand({
            name: "plugins",
            description: "Lists all installed Aliucord plugins",
            options: [],
            execute: (args, ctx) => {
                const pluginsList = Object.values(plugins);

                const enabledPlugins = pluginsList.filter(p => p.enabled).map(p => p.manifest.name);
                const disabledPlugins = pluginsList.filter(p => !p.enabled).map(p => p.manifest.name);

                const message = `
                **Total plugins**: **${Object.keys(plugins).length}**
                
                **Enabled plugins**: **${enabledPlugins.length}**
                > ${enabledPlugins.join(", ") || "None."}
                
                **Disabled plugins**: **${disabledPlugins.length}**
                > ${disabledPlugins.join(", ") || "None."}`;

                ClydeUtils.sendBotMessage(ctx.channel.id, message.replaceAll("    ", ""));
            }
        });

        this.commands.registerCommand({
            name: "eval",
            description: "Evaluate JavaScript",
            options: [
                {
                    name: "code",
                    description: "Code to eval. Async functions are not supported. Await is, however you must specify a return explicitly",
                    required: true,
                    type: ApplicationCommandOptionType.STRING
                }
            ],
            execute: async (args, ctx) => {
                try {
                    const code = args[0].value as string;

                    let result;
                    if (code.includes("await")) {
                        result = await (0, eval)(makeAsyncEval(code));
                    } else {
                        result = (0, eval)(code);
                    }

                    ClydeUtils.sendBotMessage(ctx.channel.id, this.codeblock(String(result)));
                } catch (err: any) {
                    ClydeUtils.sendBotMessage(ctx.channel.id, this.codeblock(err?.stack ?? err?.message ?? String(err)));
                }
            }
        });

        this.commands.registerCommand({
            name: "debug",
            description: "Posts debug info",
            options: [],
            execute: async (args, ctx) => {
                MessageActions.sendMessage(ctx.channel.id, {
                    content: `**Debug Info:**
                        > Discord: ${DebugInfo.discordVersion}
                        > Aliucord: ${version} (${Object.keys(plugins).length} plugins)
                        > Custom Bundle: ${customBundle}
                        > System: ${DebugInfo.system}
                        > React: ${DebugInfo.reactVersion}
                        > Hermes: ${DebugInfo.hermesVersion}
                    `.replace(/^\s+/gm, "")
                });
            }
        });
    }

    private codeblock(code: string) {
        const ZWSP = "​";
        return "```js\n" + code.replace(/`/g, "`" + ZWSP) + "```";
    }
}

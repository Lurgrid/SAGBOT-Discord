import { Client, GatewayIntentBits, Collection } from "discord.js";
import config from './Configuration/client.json' assert { type: "json" };
import { ConfigFileClient } from "./Configuration/ConfigFileClient";
import pkg from 'glob';
const { sync } = pkg;

export class BotClient{
    config: ConfigFileClient;
    bot: Client | undefined;
    cmd: Collection<string, string>;

    constructor(config: ConfigFileClient){
        this.config = config;
        this.bot = new Client({ intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildMembers
        ]});
        this.cmd = new Collection()
    }
    run = async () => {
        if (!this.bot) throw new Error("Client discord cannot be create.");
        const handlers = sync("./dist/Handler/**/*.handler.js");
        await this.bot.login(this.config.token);
        console.log(`\x1b[32m\x1b[4m${this.bot.user?.username}#${this.bot.user?.tag} is logged on to Discord.\x1b[0m\n`)
        for await (const handler of handlers){
            const hdl = (await import(handler.replace("/dist", ""))).default;
            if (typeof hdl != "function"){
                console.error(`The handler "${handler}" is not in the right format.`);
                continue;
            }
            await hdl(this);
        }
    }
}
new BotClient(config).run()
import { Client, GatewayIntentBits, Collection, ActivityType } from 'discord.js';
import config from './Configuration/client.json' assert { type: 'json' };
import { ConfigFileClient } from './Configuration/ConfigFileClient';
import Console from './Utils/console.utils.js';
import pkg from 'glob';
import { Server } from "socket.io";
import server from './Server/socket.js'
const { sync } = pkg;

export class BotClient{
    config: ConfigFileClient;
    bot: Client | undefined;
    cmd: Collection<string, string>;
    console: Console
    server: Server
    path: string

    constructor(config: ConfigFileClient){
        this.config = config;
        this.path = "./dist/Logs", 
        this.bot = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildMembers
            ],
            ws: { properties: { browser: 'Discord iOS' } }
        });
        this.cmd = new Collection();
        this.server = server(this);
        this.console = new Console(this);
    }
    run = async () => {
        if (!this.bot) throw new Error("Client discord cannot be create.");
        const handlers = sync("./dist/Handler/**/*.handler.js");
        await this.bot.login(this.config.token);
        if (!this.bot.user) return;
        this.bot.user.setPresence({ activities: [{ type: ActivityType.Competing , name: ' ' }], status: 'online'});
        for (const handler of handlers){
            const hdl = (await import(handler.replace("/dist", ""))).default;
            if (typeof hdl != "function"){
                this.console.error(`The handler "${handler}" is not in the right format.`);
                continue;
            }
            await hdl(this);
        }
        this.console.log(`\x1b[32m\x1b[4m${this.bot.user?.username}#${this.bot.user?.tag} is logged on to Discord.\x1b[0m\n`)
        this.server.emit("guildnb", this.bot.guilds.cache.size)
    }
}
new BotClient(config).run()
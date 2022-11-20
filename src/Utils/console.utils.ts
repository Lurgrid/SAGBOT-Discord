import { format } from 'util'
import { join } from 'path'
import { existsSync, mkdirSync, writeFileSync, appendFileSync } from 'fs'
import Dateformat from './Dateformat.utils.js'
import { BotClient } from '../index.js';

export default class Console {
    client: BotClient;
    path: string;
    constructor (client: BotClient){
        this.path = client.path;
        this.client = client;
        if (!existsSync(client.path)) mkdirSync(client.path);
        const logpath = join(client.path, "stdout.log");
        if (!existsSync(logpath)) writeFileSync(logpath, "");
        const errorpath = join(client.path, "stderr.log");
        if (!existsSync(errorpath)) writeFileSync(errorpath, "");
        const warnpath = join(client.path, "warn.log");
        if (!existsSync(warnpath)) writeFileSync(warnpath, "");
    }
    log = async (message?: any, ...OptionalParams: any[]): Promise<void> => {
        const m = format(message, ...OptionalParams);
        console.log(`${Dateformat()} ${m}`)
        const n = `${Dateformat()} ${m.replaceAll(/\x1b\[[0-9]{1,2}m/gim, "")}`
        this.client.server.emit("log", n)

        const logpath = join(this.path, "stdout.log");
        if (!existsSync(logpath)) await writeFileSync(logpath, "");

        await appendFileSync(logpath, `${n}\n`, "utf-8");
    }
    error = async (message?: any, ...OptionalParams: any[]): Promise<void> => {
        const m = format(message, ...OptionalParams);
        console.error(`${Dateformat()} ${m}`)
        const n = `${Dateformat()} ${m.replaceAll(/\x1b\[[0-9]{1,2}m/gim, "")}`
        this.client.server.emit("error", n)

        const errorpath = join(this.path, "stderr.log");
        if (!existsSync(errorpath)) await writeFileSync(errorpath, "");

        await appendFileSync(errorpath, `${n}\n`, "utf-8");
    }
    warn = async (message?: any, ...OptionalParams: any[]): Promise<void> => {
        const m = format(message, ...OptionalParams);
        console.warn(`${Dateformat()} ${m}`)
        const n = `${Dateformat()} ${m.replaceAll(/\x1b\[[0-9]{1,2}m/gim, "")}`
        this.client.server.emit("warn", n)

        const warnpath = join(this.path, "warn.log");
        if (!existsSync(warnpath)) await writeFileSync(warnpath, "");

        await appendFileSync(warnpath, `${n}\n`, "utf-8");
    }
}
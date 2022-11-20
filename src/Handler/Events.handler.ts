import { BotClient } from '../index';
//@ts-ignore
import Ascii from "ascii-table";
import pkg from "glob";
const { sync } = pkg;

export default async (client: BotClient): Promise<void> => {
    if (!client.bot) return;
    const Table = new Ascii("Events Loader");
    const files = sync("./dist/Events/**/*.event.js");
    if (!files.length) return;

    for (const file of files){
        const event = (await import(file.replace("/dist", "."))).default;
        const filename = file.split("/").at(-1);
        if (typeof event.name != "string"){
            await Table.addRow("MISSING",`[⛔] Event name is invalid: "${filename}"`);
            continue; 
        }
        if (typeof event.run != "function"){
            await Table.addRow(event.name, "[❗️] Erreur", "Missing 'run' function");
            continue; 
        }
        client.bot[event.once ? "once" : "on"](event.name, (...args) => {
            try {
                event.run(client, ...args);
            } catch(error) {
                client.console.error(`\x1b[41m\x1b[4m*** Error: An error occurred during the execution of the event '${event.name}'.\x1b[0m\n`);
                client.console.error(error);
            }
        });
        await Table.addRow(event.name, "[✔️] Success");
    }
    client.console.log("\n" + Table.toString());
}
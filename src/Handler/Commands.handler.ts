import { BotClient } from '../index';
//@ts-ignore
import Ascii from "ascii-table";
import pkg from "glob";
const { sync } = pkg;
import { REST, Routes, Events } from 'discord.js'

export default async (client: BotClient): Promise<void> => {
    if (!client.bot || !client.bot.application || !client.bot.application.id) return;
    const Table = new Ascii("Commands Loader");
    const files = sync("./dist/Commands/**/*.command.js");
    if (!files.length) return;
    const commands = [];
    const guild_commands: Map<string, any[]> = new Map();
    const rest = new REST({ version: '10' }).setToken(client.config.token);
    try {
        await rest.put(Routes.applicationCommands(client.bot.application.id),{ body: [] });
    } catch(error) {
        console.error(`\x1b[41m\x1b[4m*** An error occurred when clearing command data to the REST API.\x1b[0m\n`);
        console.error(error);
    }

    for (const file of files){
        const path = file.replace("/dist", ".");
        const cmd = (await import(path)).default;
        const filename = file.split("/").at(-1);
        if (filename == undefined) return;
        if (typeof cmd.data != "object"){
            await Table.addRow("MISSING",`[⛔] : "${filename}"`);
            continue; 
        }
        if (typeof cmd.run != "function"){
            await Table.addRow(cmd.name, "[❗️] Erreur", "Missing 'run' function");
            continue; 
        }
        client.cmd.set(cmd.data.name, path);
        if (typeof cmd.guild == "string"){
            let list = guild_commands.get(cmd.guild)
            if (list){
                list.push(cmd.data.toJSON())
            } else {
                list = [cmd.data.toJSON()]
            }
            guild_commands.set(cmd.guild, list);
        } else {
            commands.push(cmd.data.toJSON());   
        }
        await Table.addRow(cmd.name, "[✔️] Success");
    }
    for (const gcmd of guild_commands){
        try {
            await rest.put(Routes.applicationGuildCommands(client.bot.application.id, gcmd[0]),{ body: gcmd[1] });
        } catch(error) {
            console.error(`\x1b[41m\x1b[4m*** An error occurred when sending command guild data to the REST API.\x1b[0m\n`);
            console.error(error);
        }
    }
    try {
        await rest.put(Routes.applicationCommands(client.bot.application.id),{ body: commands });
        console.log(Table.toString());
    } catch(error) {
        console.error(`\x1b[41m\x1b[4m*** An error occurred when sending command data to the REST API.\x1b[0m\n`);
        console.error(error);
    }

    client.bot.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
        const path = client.cmd.get(interaction.commandName);
        if (!path) return;
        const cmd = (await import(path.toString())).default;
        try {
            cmd.run(client, interaction);
        } catch(error){
            console.error(`\x1b[41m\x1b[4m*** Error: An error occurred during the execution of the command '${interaction.commandName}'.\x1b[0m\n`);
            console.error(error);
        }
    })
}
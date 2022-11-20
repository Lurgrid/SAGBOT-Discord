//This event will never be trigger, because the bot start before handler

import { Events } from 'discord.js'
import { BotClient } from '../index';

export default {
    name: Events.ClientReady,
    once: true,
    run: (client: BotClient) => {
        if (!client.bot) return
        client.console.log(`\x1b[32m\x1b[4m${client.bot.user?.username}#${client.bot.user?.tag} is logged on to Discord.\x1b[0m\n`)
    }
}
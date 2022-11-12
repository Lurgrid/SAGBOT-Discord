import { SlashCommandBuilder, Interaction } from 'discord.js'
import { BotClient } from '../index';

export default {
    guild: "406498209007927316",
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    run: (client: BotClient, interaction: Interaction) => {
        if (!client.bot || !interaction.isChatInputCommand()) return
        interaction.reply({ content: 'Secret Pong!', ephemeral: true })
    }
}
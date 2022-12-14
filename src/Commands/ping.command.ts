import { SlashCommandBuilder, Interaction } from 'discord.js'
import { BotClient } from '../index';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    run: async (client: BotClient, interaction: Interaction) => {
        if (!client.bot || !interaction || !interaction.isChatInputCommand()) return
        interaction.reply({ content: 'Secret Pong !', ephemeral: true })
    }
}
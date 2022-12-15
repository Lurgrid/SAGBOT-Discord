import { SlashCommandBuilder, Interaction, EmbedBuilder } from 'discord.js'
import { BotClient } from '../index';

export default {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Replies information about the bot'),
    run: async (client: BotClient, interaction: Interaction) => {
        if (!client.bot || !interaction || !interaction.isChatInputCommand()) return
        const msg = new EmbedBuilder()
            .setColor("#36393f")
            .setTitle("Some Information About SAGBOT")
            .setURL('https://www.sagbot.com/')
            .setDescription('If you want more information, please visit our website')
            .addFields(
                { 
                    name: '-- General Information --',
                    value: 'SAGBOT is a bot created by Lurgrid and which aims to provide a complete and free bot for all. '
                         + 'The project was started in 2018/2019 under another name and only for Lurgrid\'s'
                         + ' personal use, but seeing the use that could be SAGBOT to the largest number Lurgrid decided to share it. '
                         + 'Moreover SAGBOT is totally OpenSource made in TypeScript and hosted at OVH, it uses the module "discord.js" mainly.'
                },
                {
                    name: "-- Contact --",
                    value: "Email: Contact@sagbot.com\n"
                         + "Website: https://www.sagbot.com\n"
                         + "Github: https://github.com/Lurgrid/SAGBOT-Discord"
                }
            )
            .setTimestamp()
            .setFooter({ text: 'SAGBOT', iconURL: client.bot.user?.avatarURL() || undefined });
        interaction.reply({ embeds: [msg]})
    }
}
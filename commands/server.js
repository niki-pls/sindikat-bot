const { SlashCommandBuilder } = require('@discordjs/builders');

const metadata = new SlashCommandBuilder()
    .setName('server')
    .setDescription('Replies with server information.');

module.exports = {
    metadata,

    async execute (interaction) {
        await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}\nServer created on: ${interaction.guild.createdAt}`);
    },
};

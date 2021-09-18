const { SlashCommandBuilder } = require('@discordjs/builders');

const metadata = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Replies with full avatar of specified user.')
    .addUserOption(option => option.setName('target').setDescription('Target user.'));

module.exports = {
    metadata,

    async execute (message) {
        const user = message.options.getUser('target');
        if (user) return message.reply(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`);
        return message.reply(`Your avatar: ${message.user.displayAvatarURL({ dynamic: true })}`);
    },
};

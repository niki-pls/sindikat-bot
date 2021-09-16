const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Replies with full avatar of specified user.')
        .addUserOption(option => option.setName('target').setDescription('Target user.')),
    async execute (message) {
        const user = message.options.getUser('target');
        if (user) return message.reply(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`);
        return message.reply(`Your avatar: ${message.user.displayAvatarURL({ dynamic: true })}`);
    },
};

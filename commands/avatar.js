const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Replies with full avatar of specified user.')
        .addUserOption(option => option.setName('target').setDescription('Target user.')),
	async execute(interaction) {
        const user = interaction.options.getUser('target')
        if (user) return interaction.reply(`${user.username}'s avatar: ${user.displayAvatarURL({dynamic: true})}`)
		return interaction.reply(`Your avatar: ${interaction.user.displayAvatarURL({dynamic: true})}`)
	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops playback and disconnects.'),
	async execute(interaction) {
		await interaction.channel.send('Stopping...').then(() => {
            client.destroy()
        })
	},
};
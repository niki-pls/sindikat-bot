const { SlashCommandBuilder } = require('@discordjs/builders');
const voice = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops playback and disconnects.'),
    async execute (message) {
        if (voice.getVoiceConnection(message.guild.id)) {
            await message.reply('Stopping...');
            await voice.getVoiceConnection(message.guild.id).disconnect();
        }
        else {
            await message.reply('Not connected to a voice channel.');
        }
    },
};

const { SlashCommandBuilder } = require('@discordjs/builders');
const voice = require('@discordjs/voice');

const metadata = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops playback and disconnects.');

module.exports = {
    metadata,

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

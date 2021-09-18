const { SlashCommandBuilder } = require('@discordjs/builders');
const AudioPlayerStore = require('../audio-player-store');

const metadata = new SlashCommandBuilder()
    .setName('unpause')
    .setDescription('Unpauses playback.');

module.exports = {
    metadata,

    async execute (message) {
        const player = AudioPlayerStore.get(message.member.voice.channel.id);

        if (!player) {
            return message.reply('Not playing anything currently. Play a song using /play.');
        }

        player.unpause();
        await message.reply('Unpaused.');
    },
};

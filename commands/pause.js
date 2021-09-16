const { SlashCommandBuilder } = require('@discordjs/builders');
const AudioPlayerStore = require('../audio-player-store');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses playback.'),

    async execute (message) {
        const player = AudioPlayerStore.get(message.member.voice.channel.id);

        if (!player) {
            return message.reply('Not playing anything currently. Play a song using /play.');
        }

        player.pause();
        await message.reply('Paused.');
    },
};

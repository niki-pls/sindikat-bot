const { SlashCommandBuilder } = require('@discordjs/builders');
const audioPlayerStore = require('../audio-player-store');
const metadata = new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips currently playing track.');

module.exports = {
    metadata,

    async execute(message) {
        const { voice } = message.member;

        if (!voice) {
            return message.reply({ content: 'You need to be in a voice channel', ephemeral: true });
        }

        console.log('/skip voice channel id: ', voice.channel.id);

        const player = audioPlayerStore.get(voice.channel.id);

        if (!player) {
            message.reply('Nothing is playing.');
            return;
        }

        if (player.hasNext()) {
            player.playNext();
            message.reply('Skipping.');
        } else {
            message.reply('Nothing is enqueued.');
        }
    },

};

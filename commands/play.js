const { SlashCommandBuilder } = require('@discordjs/builders');
const audioPlayerStore = require('../audio-player-store');
const { logger } = require('../utils/utils.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const metadata = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays audio from a YouTube video.')
    .addStringOption(option => option.setName('url').setDescription('Youtube video url.'));

module.exports = {
    metadata,

    async execute (message) {
        const { voice, guild } = message.member;

        if (!voice) {
            return message.reply({ content: 'You need to be in a voice channel', ephemeral: true });
        }

        const videoURL = message.options.getString('url');

        if (!videoURL) {
            return message.reply({ content: 'No URL provided', ephemeral: true });
        }

        const connection = joinVoiceChannel({
            channelId: voice.channel.id,
            guildId: guild.id,
            adapterCreator: message.member.guild.voiceAdapterCreator,
        });

        logger.info('/play voice channel id: ', voice.channel.id);

        const player = audioPlayerStore.create(voice.channel.id, connection);

        player.play(videoURL);

        message.reply('Playing');
    },
};

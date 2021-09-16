const ytdl = require('ytdl-core');
const { SlashCommandBuilder } = require('@discordjs/builders');
const audioPlayerStore = require('../audio-player-store');
const { stopwatch, logger } = require('../utils/utils.js');
const {
    StreamType,
    createAudioResource,
    joinVoiceChannel,
    VoiceConnectionStatus,
} = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays audio from a YouTube video.')
        .addStringOption(option => option.setName('url').setDescription('Youtube video url.')),

    async execute (message) {
        const { voice, guild } = message.member;

        if (!voice) {
            return message.reply({ content: 'You need to be in a voice channel', ephemeral: true });
        }

        const videoURL = message.options.getString('url');
        const stream = ytdl(videoURL, { filter: 'audioonly' });

        const connection = joinVoiceChannel({
            channelId: voice.channel.id,
            guildId: guild.id,
            adapterCreator: message.member.guild.voiceAdapterCreator,
        });

        console.log('/play voice channel id: ', voice.channel.id);

        connection.on(VoiceConnectionStatus.Signalling, () => logger.info(`Signalling for connection: ${voice.channel.id} : ${voice.channel.name}`));
        connection.on(VoiceConnectionStatus.Connecting, () => logger.info(`Connecting for connection: ${voice.channel.id} : ${voice.channel.name}`));
        connection.on(VoiceConnectionStatus.Disconnected, () => logger.info(`Disconnected for connection: ${voice.channel.id} : ${voice.channel.name}`));
        connection.on(VoiceConnectionStatus.Destroyed, () => logger.info(`Destroyed for connection: ${voice.channel.id} : ${voice.channel.name}`));

        connection.on(VoiceConnectionStatus.Ready, () => {
            const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
            const player = audioPlayerStore.create(voice.channel.id, connection);
            player.play(resource);
            logger.info(`Connection ready for ${voice.channel.id} : ${voice.channel.name}`);
            console.log(audioPlayerStore.map.keys());

            console.log(stopwatch.stop());
            return message.reply('Playing');
        });
    },
};

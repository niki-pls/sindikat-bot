const ytdl = require('ytdl-core');
const { SlashCommandBuilder } = require('@discordjs/builders');
const audioPlayerStore = require('../audio-player-store');
const {
    AudioPlayerStatus,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    VoiceConnectionStatus,
} = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays audio from a YouTube video.')
        .addStringOption(option => option.setName('url').setDescription('Youtube video url.')),

    async execute(message) {
        const { voice, guild } = message.member

        if (!voice) {
            return message.reply({ content: 'You need to be in a voice channel', ephemeral: true })
        }

        const videoURL = message.options.getString('url')
        const stream = ytdl(videoURL, { filter: 'audioonly' });
        const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });

        const connection = joinVoiceChannel({
            channelId: voice.channel.id,
            guildId: guild.id,
            adapterCreator: message.member.guild.voiceAdapterCreator,
        })

        console.log('/play voice channel id: ', voice.channel.id);

        const player = await new Promise((resolve) => {
            connection.on(VoiceConnectionStatus.Ready, () => {
                audioPlayerStore.create(voice.channel.id, connection)
                resolve(audioPlayerStore.get(voice.channel.id))
            })
        })

        player.play(resource);

        console.log(audioPlayerStore.map.entries());

        return message.reply('Playing')
    }
}
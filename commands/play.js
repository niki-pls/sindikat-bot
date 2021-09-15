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
        const { voice, guild } =  message.member
        const videoURL = message.options.getString('url')
        
        if (!voice) {
            return message.reply({content: 'You need to be in a voice channel', ephemeral: true})
        }

        const connection = joinVoiceChannel({
            channelId: voice.channel.id,
            guildId: guild.id,
            adapterCreator: message.member.guild.voiceAdapterCreator,
        });

        const stream = ytdl(videoURL, { filter: 'audioonly' });
        const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
        const player = audioPlayerStore.create(voice.channel.id, connection)
        
        player.play(resource);
       

        return message.reply('Playing')
    }
}
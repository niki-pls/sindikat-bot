const ytdl = require('ytdl-core');
const { SlashCommandBuilder } = require('@discordjs/builders');

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

        console.log(`Guild id: ${guild.id}`)
        console.log(`Voice channel id: ${voice.channel.id}`)
        console.log(`Video URL: ${videoURL}`)

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
        const player = createAudioPlayer();
        player.play(resource);
        connection.subscribe(player);
        player.on(AudioPlayerStatus.Buffering, () => console.log('buffering'))
        player.on(AudioPlayerStatus.Playing, () => console.log('playing'))
        player.on('error', error => {
            console.error(`Exception: ${error.message}`)
            player.stop(true)
        })

        connection.on(VoiceConnectionStatus.Disconnected, () => {
            console.log('destroying connection')
            return player.stop(true)
        })

        player.on('finish', () => console.log('finished playing'))
        player.on(AudioPlayerStatus.Idle, () => connection.destroy());

        return message.reply('Playing')
    }
}
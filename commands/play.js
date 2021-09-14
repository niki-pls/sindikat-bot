const ytdl = require('ytdl-core');
const { SlashCommandBuilder } = require('@discordjs/builders');

const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');
const { execute } = require('./server');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays audio from a YouTube video.')
        .addStringOption(option => option.setName('url').setDescription('Youtube video url.')),

    async execute(message) {
        console.log(message.member.guild.id)
        console.log(message.member.voice.channel.id)
        console.log(message.options.getString('url'))
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.member.guild.id,
            adapterCreator: message.member.guild.voiceAdapterCreator,
        });
        
        const stream = ytdl(message.options.getString('url'), { filter: 'audioonly' });
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
        player.on(AudioPlayerStatus.Idle, () => connection.destroy());
        return message.reply('Playing')
    }
}
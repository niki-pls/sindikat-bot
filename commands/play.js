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

    async execute(msg) {
        const connection = joinVoiceChannel({
            channelId: msg.member.voice.channel,
            guildId: msg.member.guild.id,
            adapterCreator: msg.member.guild.voiceAdapterCreator,
        });
        
        const stream = ytdl(msg.options.getString('url'), { filter: 'audioonly' });
        const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
        const player = createAudioPlayer();
        
        player.play(resource);
        connection.subscribe(player);
        
        player.on(AudioPlayerStatus.Idle, () => connection.destroy());
    },

}
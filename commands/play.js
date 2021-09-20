const { SlashCommandBuilder } = require('@discordjs/builders');
const audioPlayerStore = require('../audio-player-store');
const { joinVoiceChannel } = require('@discordjs/voice');
const { searchYoutube } = require('../utils/utils')

const metadata = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays audio from a YouTube video.')
    .addStringOption(option => option.setName('query').setDescription('Youtube video serach query.'));

module.exports = {
    metadata,

    async execute(message) {
        const { voice, guild } = message.member;

        if (!voice) {
            return message.reply({ content: 'You need to be in a voice channel', ephemeral: true });
        }

        const query = message.options.getString('query');
        const videoUrl = await searchYoutube(query);
        console.log('VIDEO URL \n', videoUrl);

        const connection = joinVoiceChannel({
            channelId: voice.channel.id,
            guildId: guild.id,
            adapterCreator: message.member.guild.voiceAdapterCreator,
        });

        const player = audioPlayerStore.create(voice.channel.id, connection);

        const trackTitle = player.play(videoUrl);
        // logger.info(`Connection ready for ${voice.channel.id} : ${voice.channel.name}`);
        message.reply(`Playing ${await trackTitle}`);
    },
};

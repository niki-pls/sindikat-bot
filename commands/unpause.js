const { SlashCommandBuilder } = require('@discordjs/builders');
const AudioPlayerStore = require('../audio-player-store')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unpause')
		.setDescription('Unpauses playback.'),

    async execute(message){
        const player = AudioPlayerStore.get(message.member.voice.channel.id)
        
        if(!player){
            return message.reply('Not playing anything currently. Play a song using /play.')
        }

        player.unpause()
        await message.reply('Unpaused.')
    }
}
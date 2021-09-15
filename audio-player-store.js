const { createAudioPlayer, VoiceConnectionStatus, AudioPlayerStatus } = require("@discordjs/voice")

class AudioPlayerStore {


    constructor() {
        this.map = new Map()
    }


    get(id){
        return this.map.get(id)
    }

    create(id, connection) {
        const player = createAudioPlayer()

        player.on('error', error => {
            console.error(`Exception: ${error.message}`)
            player.stop(true)
        })

        player.on(AudioPlayerStatus.Idle, () => connection.destroy());

        connection.on(VoiceConnectionStatus.Disconnected, () => {
            return player.stop(true)
        })

        connection.subscribe(player);

        this.map.set(id, player)

        return player
    }



}


const audioPlayerStore = new AudioPlayerStore()

module.exports = audioPlayerStore;

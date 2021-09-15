const { createAudioPlayer, VoiceConnectionStatus, AudioPlayerStatus } = require("@discordjs/voice")

class AudioPlayerStore {


    constructor() {
        this.map = new Map()
    }


    get(id) {
        return this.map.get(id)
    }

    remove(id) {
        return this.map.delete(id)
    }

    create(id, connection) {
        const player = createAudioPlayer()

        player.on('error', error => {
            console.error(`Exception: ${error.message}`)
            player.stop(true)
        })

        
        connection.on(VoiceConnectionStatus.Disconnected, () => {
            
            if (this.remove(id)) {
                
                console.log(`disconnecting from ${id}`);
                console.log(this.map.entries());
                
                return player.stop(true)
            }
        })

        connection.subscribe(player);

        this.map.set(id, player)

        return player
    }



}


const audioPlayerStore = new AudioPlayerStore()

module.exports = audioPlayerStore;
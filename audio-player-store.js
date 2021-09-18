const { VoiceConnectionStatus } = require('@discordjs/voice');
const AudioPlayerWithQueue = require('./audio-player');
const { logger } = require('./utils/utils');

class AudioPlayerStore {
    constructor () {
        this.map = new Map();
    }

    get (id) {
        return this.map.get(id);
    }

    remove (id) {
        return this.map.delete(id);
    }

    create (id, connection) {
        if (this.get(id)) {
            return this.get(id);
        }
        const player = new AudioPlayerWithQueue();
        this._setupPlayer(player, connection);
        this.map.set(id, player);

        return player;
    }

    _setupPlayer (player, connection) {
        player.on('error', error => {
            console.error(`Exception: ${error.message}`);
            player.stop(true);
        });

        connection.on(VoiceConnectionStatus.Ready, () => {
            player.isReady = true;
        });

        connection.on(VoiceConnectionStatus.Disconnected, (id) => {
            if (this.remove(id)) {
                logger.info(`disconnecting from ${id}`);
                console.log(this.map.entries());

                return player.stop(true);
            }
        });

        connection.subscribe(player);
    }
}

const audioPlayerStore = new AudioPlayerStore();

module.exports = audioPlayerStore;

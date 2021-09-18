const { AudioPlayer } = require('@discordjs/voice');
const { logger } = require('./utils/utils');


class AudioPlayerWithQueue extends AudioPlayer {
    constructor (...args) {
        super(...args);
        this.queue = [];
        this.currentlyPlaying = null;
    }

    get player () {
        return self.player;
    };

    enqueueResource (resource) {
        this.queue.push(resource);
    }

    nextInQueue () {
        const queueLength = this.queue.length;

        if (queueLength === 0) {
            return undefined;
        }

        return this.queue[queueLength - 1];
    }

    isCurrentlyPlaying () {
        return !!this.currentlyPlaying;
    }

    playNext () {
        if (this.queue.length === 0) {
            return;
        }

        this.currentlyPlaying = this.queue.shift();
        this.player.play(this.currentlyPlaying);
    }

    play (resource) {
        if (this.isCurrentlyPlaying()) {
            logger.info(`Enquing: ${resource}`);
            this.enqueueResource(resource);
            return true;
        }
        else {
            logger.info(`Playing: ${resource}`);
            this.currentlyPlaying = resource;
            super.play(resource);
            return false;
        }
    }
}

function createAudioPlayerWithQueue (...args) {
    return new AudioPlayerWithQueue(...args);
}

module.exports = createAudioPlayerWithQueue;

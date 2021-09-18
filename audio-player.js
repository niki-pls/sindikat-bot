const { AudioPlayer, StreamType, createAudioResource } = require('@discordjs/voice');
const { logger, sleep } = require('./utils/utils');
const ytdl = require('ytdl-core');


class AudioPlayerWithQueue extends AudioPlayer {
    constructor(...args) {
        super(...args);
        this.queue = [];
        this.currentlyPlaying = null;
        this.isReady = false;
    }

    // get player () {
    //     return self.player;
    // };

    enqueueResource(track) {
        this.queue.push(track);
    }

    nextInQueue() {
        const queueLength = this.queue.length;

        if (queueLength === 0) {
            return undefined;
        }

        return this.queue[queueLength - 1];
    }

    isCurrentlyPlaying() {
        return !!this.currentlyPlaying;
    }

    playNext() {
        if (this.queue.length === 0) {
            return;
        }
        this.stop(true);
        this.currentlyPlaying = null;
        console.log(this._state);
        console.log(this.queue);
        const nextInQueue = this.queue.shift();
        this.play(nextInQueue.url);
    }

    hasNext() {
        return !!this.queue.length;
    }

    async play(videoURL) {
        while (!this.isReady) {
            console.log('waiting', this);
            await sleep(100);
        }
        const trackInfo = await ytdl.getInfo(videoURL);
        const track = {
            title: trackInfo.videoDetails.title,
            url: trackInfo.videoDetails.video_url,
        };
        const stream = ytdl(videoURL, { filter: 'audioonly' });
        const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });

        if (this.isCurrentlyPlaying()) {
            logger.info(`Enquing: ${track.title}`);
            this.enqueueResource(track);
        }
        else {
            logger.info(`Playing: ${resource}`);
            this.currentlyPlaying = resource;
            super.play(resource);
        }
        return track.title;
    }
}

module.exports = AudioPlayerWithQueue;

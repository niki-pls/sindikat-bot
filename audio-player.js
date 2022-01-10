const { AudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { logger, sleep } = require('./utils/utils');
const play = require('play-dl');

class AudioPlayerWithQueue extends AudioPlayer {
    constructor (...args) {
        super(...args);
        this.queue = [];
        this.currentlyPlaying = null;
        this.isReady = false;

        this.on(AudioPlayerStatus.Idle, this.onIdle);
    }

    enqueueResource (track) {
        this.queue.push(track);
    }

    nextInQueue () {
        const queueLength = this.queue.length;

        if (queueLength === 0) {
            return undefined;
        }

        return this.queue[0];
    }

    isCurrentlyPlaying () {
        return !!this.currentlyPlaying;
    }

    onIdle () {
        if (this.hasNext()) {
            logger.info(`Playing next song ${this.nextInQueue().title}`);
            this.playNext();
        }
        else {
            logger.info('Going IDLE');
            this.currentlyPlaying = false;
        }
    }

    playNext () {
        if (this.queue.length === 0) {
            return;
        }
        this.currentlyPlaying = null;
        console.log(this._state);
        console.log(this.queue);
        const nextInQueue = this.queue.shift();
        this.play(nextInQueue.url);
    }

    hasNext () {
        return !!this.queue.length;
    }

    disconnectListeners () {
        logger.info('Removing listeners');
        this.off(AudioPlayerStatus.Idle, this.onIdle);
    }

    async play (videoURL) {
        while (!this.isReady) {
            console.log('waiting', this);
            await sleep(100);
        }
        const yt_info = await play.video_info(videoURL);
        const stream = await play.stream_from_info(yt_info);

        const track = {
            title: yt_info.video_details.title,
            url: videoURL,
        };

        const resource = createAudioResource(stream.stream, { inputType: stream.type });

        if (this.isCurrentlyPlaying()) {
            logger.info(`Enquing: ${track.title}`);
            this.enqueueResource(track);
        }
        else {
            logger.info(`Playing: ${track.title}`);
            this.currentlyPlaying = resource;
            super.play(resource);
        }
        return track.title;
    }
}
module.exports = AudioPlayerWithQueue;

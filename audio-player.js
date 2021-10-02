const { AudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { join } = require('path');

const { logger, sleep } = require('./utils/utils');
const { download } = require('./utils/download');
const { deleteFile, getFilename } = require('./utils/fsUtils');


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
        const currentTrack = this.currentlyPlaying;

        deleteFile(getFilename(currentTrack));

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
        if (!videoURL) {
            logger.warn('No url provided!');
            return;
        }
        while (!this.isReady) {
            // console.log('waiting', this);
            await sleep(100);
        }

        const trackInfo = await download(videoURL);

        const track = {
            title: trackInfo.songTitle,
            ext: trackInfo.ext,
            url: videoURL,
        };

        const filename = getFilename(track);


        const resource = createAudioResource(join(__dirname, `/downloads/${filename}`));

        if (this.isCurrentlyPlaying()) {
            logger.info(`Enquing: ${track.title}`);
            this.enqueueResource(track);
        }
        else {
            logger.info(`Playing: ${track.title}`);
            this.currentlyPlaying = track;
            super.play(resource);
        }
        return track.title;
    }
}

module.exports = AudioPlayerWithQueue;

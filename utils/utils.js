const fs = require('fs');
const ytSearch = require('@citoyasha/yt-search');

class Stopwatch {
    constructor() {
        this.startTime = null;
        this.stopTime = null;
        this.label = 'defaultStopwatchLabel';
    }

    start(label = null) {
        this.startTime = +new Date();
        this.stopTime = null;
        this.label = label || this.label;
        console.time(this.label);
    }

    stop() {
        this.stopTime = +new Date();
        console.timeEnd(this.label);
        return this.elapsed();
    }

    elapsed() {
        if (!this.stopTime) {
            return this.stop();
        }
        return (this.stopTime - this.startTime) / 1000;
    }
}

class Logger {
    info(message) {
        console.info(new Date().toUTCString(), message);
    }

    warn(message) {
        console.warn(new Date().toUTCString(), message);
    }

    error(message) {
        console.error(new Date().toUTCString(), message);
    }
}

function getCommands() {
    return fs.readdirSync('./commands')
        .filter(file => file.endsWith('.js'))
        .map(file => require(`../commands/${file}`));
}

function sleep (milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function searchYoutube(query) {
    const result = await ytSearch.search(query, 1);
    const videoUrl = result[0].link;
    return videoUrl;
}

const stopwatch = new Stopwatch();
const logger = new Logger();

module.exports = { stopwatch, logger, getCommands, sleep, searchYoutube };

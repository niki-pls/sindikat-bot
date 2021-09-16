class Stopwatch {
    constructor () {
        this.startTime = null;
        this.stopTime = null;
    }

    start () {
        this.startTime = +new Date();
        this.stopTime = null;
    }

    stop () {
        this.stopTime = +new Date();
        return this.elapsed();
    }

    elapsed () {
        if (!this.stopTime) {
            return this.stop();
        }

        return (this.stopTime - this.startTime) / 1000;
    }
}

class Logger {
    info (message) {
        console.info(new Date().toUTCString(), message);
    }

    warn (message) {
        console.warn(new Date().toUTCString(), message);
    }

    error (message) {
        console.error(new Date().toUTCString(), message);
    }
}

const stopwatch = new Stopwatch();
const logger = new Logger();

module.exports = { stopwatch, logger };

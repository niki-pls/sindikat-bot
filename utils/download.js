const util = require('util');
const exec = util.promisify(require('child_process').exec);


async function download (url) {
    const { stdout, stderr } = await exec(`youtube-dl "${url}" --no-progress -o "downloads/%(title)s.%(ext)s"`);
    console.info(stdout);
    stderr && console.error(stderr);

    const titleRegex = /downloads\\(?<title>.*)(?<ext>\.\w*)/;
    const match = stdout.match(titleRegex);
    const songTitle = match.groups.title;
    const ext = match.groups.ext;
    return { songTitle, ext };
}

module.exports = { download };

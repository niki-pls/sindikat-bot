const fsPromies = require('fs/promises');
const { join } = require('path');
const { logger } = require('./utils');

function getFilename ({ title, ext }) {
    return title.concat(ext);
}

async function clearDownloads () {
    logger.info('Deleteting downloads folder');
    await fsPromies.rm('downloads');
    await fsPromies.mkdir('downloads');
}

async function deleteFile (filename) {
    const path = join('downloads', filename);
    logger.info(`Deleting ${path}`);
    await fsPromies.rm(path, { maxRetries: 5 });
};

module.exports = { deleteFile, getFilename, clearDownloads };

const micromatch = require('micromatch');
const pug = require('pug');
const Logger = require('@ui5/logger').getLogger('ui5-pug');

function renderPug(inputCode, options) {
    return pug.render(inputCode, options);
}

function includeFiles(files, patterns) {
    const matchableFiles = files.map(file => file.getPath());
    let matches = micromatch(matchableFiles, patterns);
    return files.filter(file => matches.includes(file.getPath()));
}

function excludeFiles(files, patterns) {
    const matchableFiles = files.map(file => file.getPath());
    let matches = micromatch(matchableFiles, patterns);
    return files.filter(file => !matches.includes(file.getPath()));
}

function removeFileExtension(path) {
    let parts = path.split(".");
    parts.pop();
    return parts.join(".");
}

module.exports = {
    Logger,
    renderPug,
    includeFiles,
    excludeFiles,
    removeFileExtension
}
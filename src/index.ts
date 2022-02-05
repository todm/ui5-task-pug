import { Resource } from "@ui5/fs";
import { getLogger } from "@ui5/logger";
import micromatch from "micromatch";
import pug from 'pug';

export function renderPug(code: string, options?: pug.Options & pug.LocalsObject) {
    return pug.render(code, options || {});
}

export function includeFiles(files: Resource[], patterns: string | string[]) {
    const matchableFiles = files.map(file => file.getPath());
    const matches = micromatch(matchableFiles, patterns);
    return files.filter(file => matches.includes(file.getPath()));
}

export function excludeFiles(files: Resource[], patterns: string | string[]) {
    const matchableFiles = files.map(file => file.getPath());
    const matches = micromatch(matchableFiles, patterns);
    return files.filter(file => !matches.includes(file.getPath()));
}

export function removeFileExtension(path: string) {
    return path.split('.').slice(0, -1).join('.');
}

export const Logger = getLogger('ui5-pug');
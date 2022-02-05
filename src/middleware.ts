import { Resource } from '@ui5/fs';
import { MiddlewareFunction } from '@ui5/server';
import micromatch from 'micromatch';
import { MiddlewareConfig } from '../types';
import { Request } from 'express';
import { includeFiles, Logger, removeFileExtension, renderPug } from '.';

const middleware: MiddlewareFunction = ({ resources, options }) => {
    const config: MiddlewareConfig = {
        include: ['**/*.xml'],
        exclude: [],
        pugOptions: {},
        searchInclude: ['**/*.pug'],
        passFile: false,
        onError: 'error',
        ...options.configuration
    };

    return async (req: PRequest, res, next) => {
        try {
            const matched = !!micromatch([req.path], config.include).length && !micromatch([req.path], config.exclude).length;
            if (!matched) return next();

            let file: Resource;
            if (req.passedFile) {
                file = req.passedFile;
            } else {
                let potentialFiles = await resources.rootProject.byGlob(removeFileExtension(req.path) + '.*');
                potentialFiles = includeFiles(potentialFiles, config.searchInclude);
                if (!potentialFiles.length) return next();
                file = potentialFiles[0];
            }

            const code = await file.getString();
            const result = renderPug(code, config.pugOptions);

            if (config.passFile) {
                file.setString(result);
                req.passedFile = file;
                return next();
            }
            res.end(result);
        } catch (ex) {
            const msg = (<Error>ex).message || 'Unknown Error';
            Logger.error(msg);
            switch (config.onError) {
                case 'next':
                    return next();
                case 'error':
                    return res.status(503).end();
                default: process.exit(-1);
            }
        }
    };
};

interface PRequest extends Request {
    passedFile?: Resource;
}

module.exports = middleware;

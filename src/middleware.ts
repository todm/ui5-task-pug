import { MiddlewareFunction } from '@ui5/server';
import { BaseConfig, splitPathExtension } from './utils';
import micromatch from 'micromatch';
import PugTransformer from './transformer';

interface MiddlewareConfig extends BaseConfig {
    searchInclude: string | string[];
    searchExclude: string | string[];
    onError: 'next' | 'error' | 'exit';
}

const middlewareFunction: MiddlewareFunction = ({ options, middlewareUtil, resources, log }) => {
    const config: MiddlewareConfig = {
        include: ['**/*.xml'],
        exclude: [],
        pugVariables: {},
        pretty: false,
        searchInclude: ['**/*.pug'],
        searchExclude: [],
        onError: 'error',
        ...options.configuration
    };

    const transformer = new PugTransformer(middlewareUtil.getProject(), config.pugVariables, config.pretty);

    const reader = middlewareUtil.resourceFactory.createFilterReader({
        reader: resources.all,
        callback: r => micromatch.isMatch(r.getPath(), config.searchInclude, { ignore: config.searchExclude })
    });

    return async (req, res, next) => {
        try {
            const path = middlewareUtil.getPathname(req);
            const matched = micromatch.isMatch(path, config.include, { ignore: config.exclude });
            if (!matched) return next();

            const searchString = splitPathExtension(path)[0] + '.*';
            const potentialResources = await reader.byGlob(searchString);
            const resource = potentialResources[0];
            if (!resource) return next();

            const contents = await resource.getString();
            const transformed = transformer.transform(contents, resource.getPath());

            res.end(transformed);
        } catch (ex: any) {
            log.error(ex.message || 'unknown error');
            switch (config.onError) {
                case 'next':
                    return next();
                case 'exit':
                    return process.exit(-1);
                default:
                    return res.status(503).end();
            }
        }
    };
};

module.exports = middlewareFunction;

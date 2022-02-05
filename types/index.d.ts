import pug from "pug";

export interface BaseConfig {
    include: string | string[];
    exclude: string | string[];
    pugOptions: pug.Options & pug.LocalsObject;
}

export interface TaskConfig extends BaseConfig {
    forceExtension: string | false;
}

export interface MiddlewareConfig extends BaseConfig {
    searchInclude: string | string[];
    passFile: boolean;
    onError: 'next' | 'error' | 'exit';
}

import { ProjectInterface } from '@ui5/project/lib/build/helpers';
import pug from 'pug';
import { getRealPath } from './utils';

export default class PugTransformer {
    constructor(private project: ProjectInterface, private pugVariables: any, private pretty: boolean) {}

    transform(contents: string, path: string) {
        const filePath = getRealPath(path, this.project);
        const basePath = this.project.getSourcePath();
        return pug.render(contents, {
            ...this.pugVariables,
            basedir: basePath,
            filename: filePath,
            pretty: this.pretty
        });
    }
}

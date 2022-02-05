import { TaskFunction } from '@ui5/builder';
import { excludeFiles, removeFileExtension, renderPug } from '.';
import { TaskConfig } from '../types';

const task: TaskFunction = async ({ workspace, options }) => {
    const config: TaskConfig = {
        include: ['**/*.pug'],
        exclude: [],
        pugOptions: {},
        forceExtension: 'xml',
        ...options.configuration
    };

    let files = await workspace.byGlob(config.include);
    files = excludeFiles(files, config.exclude);
    await Promise.all(files.map(async file => {
        const code = await file.getString();
        const result = renderPug(code, config.pugOptions);
        if(config.forceExtension) file.setPath(
            removeFileExtension(file.getPath()) + "." + config.forceExtension
        );
        file.setString(result);
        await workspace.write(file);
    }));
};

module.exports = task;

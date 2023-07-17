import { DetermineRequiredDependenciesFunction, TaskFunction } from '@ui5/builder';
import micromatch from 'micromatch';
import { BaseConfig, splitPathExtension } from './utils';
import PugTransformer from './transformer';

interface TaskConfig extends BaseConfig {
    forceExtension: string;
}

const taskFunction: TaskFunction<TaskConfig> = async ({ options, taskUtil, workspace }) => {
    const config: TaskConfig = {
        include: ['**/*.pug'],
        exclude: [],
        pugVariables: {},
        pretty: false,
        forceExtension: 'xml',
        ...options.configuration
    };

    const transformer = new PugTransformer(taskUtil.getProject(), config.pugVariables, config.pretty);

    const reader = taskUtil.resourceFactory.createFilterReader({
        reader: workspace,
        callback: r => micromatch.isMatch(r.getPath(), config.include, { ignore: config.exclude })
    });

    const resources = await reader.byGlob(config.include);

    await Promise.all(
        resources.map(async resource => {
            const contents = await resource.getString();
            const transformed = transformer.transform(contents, resource.getPath());

            const file = taskUtil.resourceFactory.createResource({ path: resource.getPath(), string: transformed });
            const [path, ext] = splitPathExtension(resource.getPath());
            if (config.forceExtension && ext !== config.forceExtension) {
                file.setPath(path + '.' + config.forceExtension);
                taskUtil.setTag(resource, taskUtil.STANDARD_TAGS.OmitFromBuildResult);
            }
            await workspace.write(file);
        })
    );
};

const determineRequiredDependencies: DetermineRequiredDependenciesFunction = async ({ availableDependencies, getProject }) => {
    availableDependencies.forEach(name => getProject(name).isFrameworkProject() && availableDependencies.delete(name));
    return availableDependencies;
};

module.exports = taskFunction;
module.exports.determineRequiredDependencies = determineRequiredDependencies;

const { renderPug, excludeFiles, removeFileExtension } = require(".");

/**
 * Babel task
 *
 * @param {object} parameters Parameters
 * @param {module:@ui5/fs.DuplexCollection} parameters.workspace DuplexCollection to read and write files
 * @param {module:@ui5/fs.AbstractReader} parameters.dependencies Reader or Collection to read dependency files
 * @param {object} parameters.taskUtil Specification Version dependent interface to a
 *                [TaskUtil]{@link module:@ui5/builder.tasks.TaskUtil} instance
 * @param {object} parameters.options Options
 * @param {string} parameters.options.projectName Project name
 * @param {string} [parameters.options.projectNamespace] Project namespace if available
 * @param {string} [parameters.options.configuration] Task configuration if given in ui5.yaml
 * @returns {Promise<undefined>} Promise resolving with <code>undefined</code> once data has been written
 */
 module.exports = async function({workspace, dependencies, taskUtil, options}) {
    const config = {
        include: ["**/*.pug"],
        exclude: [],
        pugOptions: {},
        forceExtension: "xml",
        ...options.configuration
    };

    let files = await workspace.byGlob(config.include);
    file = excludeFiles(files, config.exclude);
    await Promise.all(files.map(async file => {
        let code = await file.getString();
        let result = renderPug(code, config.pugOptions);

        if(config.forceExtension) file.setPath(
            removeFileExtension(file.getPath()) + "." + config.forceExtension
        );
        file.setString(result);
        workspace.write(file);
    }));
};
/**
 * Main converter
 */
'use strict';

var Promise = require('bluebird');
var fs = require('fs');
var fse = Promise.promisifyAll(require('fs-extra'));
var path = require('path');
var _ = require('lodash');
var is = require('is_js');
var helper = require('./helper.js');
var moment = require('moment')();


/**
 * Load core converting methods
 */
var converter = {
    convertToHtml: require('./convert-to-html-core'),
    convertToPdf : require('./convert-to-pdf-core')
};

/**
 * Default converting options.
 * @type object
 * @private
 */
converter._defaultOptions = {
    /**
     * source
     * Markdown source file path.
     */

    /**
     * directory
     * The directory that output file will be store in.
     */

    /**
     * name
     * Specify the output file's name.
     */

    type: 'html'
    // Default output type.
};

/**
 * Main convert method.
 * @param options
 */
converter.convert = function (options) {
    var useOptions = options;
    var outputFileBasename, outputFilePath;
    if (Array.isArray(options.source)) {
        var self = this;
        options.source.forEach(function(src) {
            self.convert({
                directory: options.directory,
                type: options.type,
                source: src
            });
        });
        return;
    }
    // get the output file's base filename(without extension name)
    if (useOptions.name) {
        outputFileBasename = useOptions.name;
    } else {
        outputFileBasename = converter.getOutputFilename(path.basename(useOptions.source, '.md'));
    }

    // assemble the full output file path
    outputFilePath = useOptions.directory + path.sep + outputFileBasename + '.' + useOptions.type;

    // if there is a file on the target file path, end this
    if (fs.existsSync(outputFilePath)) {
        throw new Error('There is already a file on the target path "' + outputFilePath + '".');
    }

    /**
     * start the whole process...
     */
    Promise.resolve().
        then(function () {
            /**
             * make the output directory
             */
            return new Promise(function (resolve, reject) {
                fse.mkdirs(path.dirname(outputFilePath), function (err) {
                    if (err) throw err;

                    resolve();
                });
            });
        }).
        then(function () {
            /**
             * converting markdown to target type
             */
            return new Promise(function (resolve, reject) {
                switch (useOptions.type) {
                    case 'html':
                        converter.convertToHtml(useOptions.source, outputFilePath, resolve);

                        break;
                    case 'pdf':
                        converter.convertToPdf(useOptions.source, outputFilePath, resolve);

                        break;
                    default:
                        throw new Error('Unknown output type "' + useOptions.type + '"');
                        break;
                }
            });
        }).
        error(function (msg) {
            helper.showError(msg, true);
        });

};

/**
 * Get output file name by source file's base filename
 *
 * @param sourceFileBaseName
 * @returns {string}
 */
converter.getOutputFilename = function (sourceFileBaseName) {
    var appendName = '_' + moment.format('YYYYMMDD') +
        Math.random().toString().substr(-3);

    return sourceFileBaseName + appendName;
};

/**
 * Generate converting options from CLI parameters.
 *
 * @param argv
 * @return object
 */
converter.generateOptions = function (argv) {
    var options = converter._defaultOptions;

    /**
     * CLI arguments validation
     */
    if (argv._.length == 0) {
        helper.showHelp();
    }
    if (argv._.length > 2 && !argv.multi && !argv.m) {
        throw new Error('Too many parameters.');
    }

    /**
     * check source file's existance
     */
    options.source = helper.pathIsAbsolute(argv._[0]) ?
                     argv._[0] :
                     path.resolve(process.cwd(), argv._[0]);
    if (!fs.existsSync(options.source)) {
        throw new Error('File "' + options.source + '" not exists.');
    }

    /**
     * check if specified a output filename
     */
    if (argv.name) {
        options.name = argv.name;
    }

    //last _ item is not a directory
    if (argv.multi || argv.m) {
        options.source = argv._
            .concat([argv.multi || argv.m])
            .filter(function(file) {
                return file.indexOf('.md') !== -1;
            })
            .map(function(file) {
                return helper.pathIsAbsolute(file) ?
                    file :
                    path.resolve(process.cwd(), file);
            });
        if (argv._[argv._.length - 1].indexOf('.md') === -1) {
            options.directory = helper.pathIsAbsolute(process.cwd(), options.source[0]) ?
                                argv._[argv._.length - 1] :
                                path.resolve(process.cwd(), options.source[0]);
        } else {
            options.directory = process.cwd();
        }
    } else if (argv._.length >= 2) {
    /**
     * setting up output file's directory
     */
        options.directory = helper.pathIsAbsolute(argv._[1]) ?
                            argv._[1] :
                            path.resolve(process.cwd(), argv._[1]);
    } else {
        options.directory = path.dirname(options.source);
    }

    /**
     * check if user want to converting to pdf
     */
    if (argv.pdf && argv.pdf == true) {
        options.type = 'pdf';
    }
    return options;
};

module.exports = converter;
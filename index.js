'use strict';

// mostly ripped from lab: https://github.com/hapijs/lab/blob/master/lib/linter/index.js

const Eslint = require('eslint');

exports.lint = function () {

    const configuration = {
        ignore: true
    };

    const engine = new Eslint.CLIEngine(configuration);
    const results = engine.executeOnFiles(['.']);

    return results.results.map((result) => {

        const transformed = {
            filename: result.filePath
        };

        if (result.hasOwnProperty('output')) {
            transformed.fix = {
                output: result.output
            };
        }

        transformed.errors = result.messages.map((err) => {

            return {
                line: err.line,
                severity: err.severity === 1 ? 'WARNING' : 'ERROR',
                message: err.ruleId + ' - ' + err.message
            };
        });

        return transformed;
    });
};

console.log(exports.lint());

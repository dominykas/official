#!/usr/bin/env node
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

if (require.main === module) {

    let errors = 0;
    let warnings = 0;

    const lintResults = exports.lint();
    lintResults.forEach((entry) => {

        if (!entry.errors || !entry.errors.length) {
            return;
        }

        console.error(`\n\t${entry.filename}:`);

        entry.errors.forEach((err) => {

            if (err.severity === 'ERROR') {
                ++errors;
            }
            else {
                ++warnings;
            }

            console.error(`\n\t\tLine ${err.line}: ${err.message}`);
        });

    });

    if (errors + warnings > 0) {
        process.exit(1);
    }
    else {
        console.log('No issues');
    }

}

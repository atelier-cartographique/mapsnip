#!/usr/bin/env node

var fs = require('fs');

var argv = process.argv.slice(2),
    fontfile = argv[1],
    dest = argv[2];





function processFontfile (err, data) {
    if (err) {
        throw err;
    }

    var targetData = 'module.exports = exports = "'+data.toString('base64')+'";';
    fs.writeFile(dest, targetData, function (err) {
            if (err) {
                throw err;
            }

            console.log('success');
    });
}

fs.readFile(fontfile, processFontfile);

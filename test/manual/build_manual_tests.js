#!/usr/bin/env node
const rollup = require("rollup");
const fs = require("fs");
const path = require("path");

const SRC_DIR = "./src";
const DST_DIR = "./js";

const rollupFile = function (file) {
    if (file.endsWith(".js")) {
        const inFile = path.join(SRC_DIR, file); 
        const outFile = path.join(DST_DIR, file);


        rollup.rollup({
            entry: inFile,
        }).then(function (bundle) {
            bundle
                .write({
                        dest: outFile,
                        format: "es"
                    })
                .catch(console.error);
                    
            console.log(`Building ${inFile}; storing in ${outFile}`);
        }).catch(console.error);
    }
};

fs.readdir(SRC_DIR, (err, files) => {
    if (err) {
        console.error(`Error while reading ${SRC_DIR}`);
    }

    files.forEach(rollupFile);
});

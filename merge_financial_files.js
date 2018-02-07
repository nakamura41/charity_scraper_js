const {readFileSync, writeFileSync} = require('fs');
var glob = require("glob");
const Papa = require('papaparse');

let outputData = [];

const inputFilePrefix = './data/detail/financial_*';

try {
    glob(inputFilePrefix, [], function (er, fileNames) {
        fileNames.forEach(fileName => {
            console.log(fileName);
            let inputData = {};
            const inputFile = readFileSync(fileName, {encoding: 'utf8'});
            Papa.parse(inputFile, {
                header: true,
                complete: function (results) {
                    inputData = results.data;
                }
            });
            outputData = outputData.concat(inputData);
        });

        writeFileSync(`./data/final/financial.csv`, Papa.unparse(outputData), {encoding: 'utf8'});
    });
} catch (e) {
    console.error(e);
}
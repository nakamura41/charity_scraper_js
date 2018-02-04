const {readFileSync, writeFileSync} = require('fs');
const Papa = require('papaparse');

const categoryId = 2;
const count = 36;

let outputData = [];

try {
    for (let i = 1; i <= count; i++) {
        console.log(`read file: output_${categoryId}_${i}.csv`);
        const inputFile = readFileSync(`./data/output_${categoryId}_${i}.csv`,
            {encoding: 'utf8'});
        let inputData = {};
        Papa.parse(inputFile, {
            header: true,
            complete: function (results) {
                inputData = results.data;
            }
        });

        outputData = outputData.concat(inputData);
    }

    writeFileSync(`./data/output_${categoryId}.csv`, Papa.unparse(outputData), {encoding: 'utf8'});

    console.log(`write file: output_${categoryId}.csv`)
} catch (e) {
    console.error(e);
}


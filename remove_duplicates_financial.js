const {readFileSync, writeFileSync} = require('fs');
var glob = require("glob");
const Papa = require('papaparse');

let outputData = [];
let dict = {};

const fileName = './data/final/charities_financial_raw.csv';

try {
    console.log(fileName);
    let inputData = {};
    const inputFile = readFileSync(fileName, {encoding: 'utf8'});
    Papa.parse(inputFile, {
        header: true,
        complete: function (results) {
            inputData = results.data;
        }
    });

    inputData.forEach(item => {
        if (dict[item['uen']] === undefined) {
            dict[item['uen']] = {};
        }
        if (dict[item['uen']][item['financial_period']] === undefined) {
            item['financial_year'] = item['financial_period'].substr(4, 4) + '-' + item['financial_period'].substr(15, 4);
            outputData.push(item);
            dict[item['uen']][item['financial_period']] = 1;
        }
    });

    writeFileSync(`./data/final/charities_financial_information.csv`, Papa.unparse(outputData), {encoding: 'utf8'});

    console.log('Done');
} catch (e) {
    console.error(e);
}
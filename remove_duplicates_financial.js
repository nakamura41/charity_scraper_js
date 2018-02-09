const {readFileSync, writeFileSync} = require('fs');
var glob = require("glob");
const Papa = require('papaparse');

let outputData = [];
let dict = {};

const fileName = './data/final/charities_financial_information.csv';

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
        if (dict[item['uen']][item['index']] === undefined) {
            outputData.push(item);
            dict[item['uen']][item['index']] = 1;
        }
    });

    writeFileSync(`./data/final/charities_financial_clean.csv`, Papa.unparse(outputData), {encoding: 'utf8'});

    console.log('Done');
} catch (e) {
    console.error(e);
}
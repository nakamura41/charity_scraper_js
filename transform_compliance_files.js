const {readFileSync, writeFileSync} = require('fs');
var glob = require("glob");
const Papa = require('papaparse');

let outputData = [];

const fileName = './data/final/compliance.csv';

try {
    let inputData = {};
    const inputFile = readFileSync(fileName, {encoding: 'utf8'});
    Papa.parse(inputFile, {
        header: true,
        complete: function (results) {
            inputData = results.data;
        }
    });
    outputData = outputData.concat(inputData);

    let uenDict = {};

    let newData = [];
    outputData.forEach(data => {

        if (uenDict[data['uen']] === undefined) {
            for (let i = 1; i <= 30; i++) {
                let index = `${i}`;
                if (index < 10) {
                    index = `0${i}`;
                }
                if (data[`q${index}_desc`] !== '' && data[`q${index}_desc`] !== undefined) {
                    let tempData = {};
                    tempData['uen'] = data['uen'];
                    tempData['name'] = data['name'];
                    tempData['primary_sector'] = data['primary_sector'];
                    tempData['sub_setor'] = data['sub_setor'];
                    tempData['index'] = data['index'];
                    tempData['category_id'] = data['category_id'];
                    tempData['evaluation_period'] = data['evaluation_period'];
                    tempData['evaluation_status'] = data['evaluation_status'];
                    tempData['code_no'] = data[`q${index}_no`];
                    tempData['code_desc'] = data[`q${index}_desc`];
                    tempData['code_id'] = data[`q${index}_code_id`];
                    tempData['code_compliance'] = data[`q${index}_compliance`];
                    tempData['code_explanation'] = data[`q${index}_explanation`];
                    newData.push(tempData);
                }
            }
            uenDict[data['uen']] = 1;
        }
    });

    writeFileSync(`./data/final/charities_code_compliances.csv`, Papa.unparse(newData), {encoding: 'utf8'});
} catch (e) {
    console.error(e);
}
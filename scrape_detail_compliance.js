const {readFileSync, writeFileSync} = require('fs');
const {csvFormat} = require('d3-dsv');
const Nightmare = require('nightmare');
const Papa = require('papaparse');

const START = 'https://www.charities.gov.sg/_layouts/MCYSCPSearch/MCYSCPSearchCriteriaPage.aspx';
const charityPerPage = 5;

const layoutProfileMapping = {
    'name': '#ctl00_PlaceHolderMain_LabelOrgName',
    'uen': '#ctl00_PlaceHolderMain_lblUENNo',
};

const layoutComplianceMapping = {
    'q01': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(2) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(2) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(2) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(2) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(2) > td:nth-child(5)'
    },
    'q04': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(3) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(3) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(3) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(3) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(3) > td:nth-child(5)'
    },
    'q05': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(4) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(4) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(4) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(4) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(4) > td:nth-child(5)'
    },
    'q06': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(5) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(5) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(5) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(5) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(5) > td:nth-child(5)'
    },
    'q07': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(6) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(6) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(6) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(6) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(6) > td:nth-child(5)'
    },
    'q08': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(7) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(7) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(7) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(7) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(7) > td:nth-child(5)'
    },
    'q09': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(8) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(8) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(8) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(8) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(8) > td:nth-child(5)'
    },
    'q10': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(9) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(9) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(9) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(9) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(9) > td:nth-child(5)'
    },
    'q11': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(10) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(10) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(10) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(10) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(10) > td:nth-child(5)'
    },
    'q12': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(11) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(11) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(11) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(11) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(11) > td:nth-child(5)'
    },
    'q13': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(12) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(12) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(12) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(12) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(12) > td:nth-child(5)'
    },
    'q14': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(13) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(13) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(13) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(13) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(13) > td:nth-child(5)'
    },
    'q15': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(14) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(14) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(14) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(14) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(14) > td:nth-child(5)'
    },
    'q16': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(15) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(15) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(15) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(15) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(15) > td:nth-child(5)'
    },
    'q17': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(16) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(16) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(16) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(16) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(16) > td:nth-child(5)'
    },
    'q19': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(17) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(17) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(17) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(17) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(17) > td:nth-child(5)'
    },
    'q20': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(18) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(18) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(18) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(18) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(18) > td:nth-child(5)'
    },
    'q21': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(19) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(19) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(19) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(19) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(19) > td:nth-child(5)'
    },
    'q24': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(20) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(20) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(20) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(20) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(20) > td:nth-child(5)'
    },
    'q25': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(21) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(21) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(21) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(21) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(21) > td:nth-child(5)'
    },
    'q26': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(22) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(22) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(22) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(22) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(22) > td:nth-child(5)'
    },
    'q27': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(23) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(23) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(23) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(23) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(23) > td:nth-child(5)'
    },
    'q28': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(24) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(24) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(24) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(24) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(24) > td:nth-child(5)'
    },
    'q29': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(25) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(25) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(25) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(25) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(25) > td:nth-child(5)'
    },
    'q30': {
        'no': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(26) > td:nth-child(1)',
        'desc': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(26) > td:nth-child(2)',
        'code_id': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(26) > td:nth-child(3)',
        'compliance': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(26) > td:nth-child(4)',
        'explanation': '#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(26) > td:nth-child(5)'
    }
};

function calculatePageCount(recordNumber) {
    return Math.ceil(recordNumber / charityPerPage);
}

function getTargetLink(pageNo) {
    // charities.gov.sg has a very weird pagination system (1 => 16 => 26 => ...) ???
    return (pageNo !== 1 ? `#a${pageNo}` : '');
}

const nightmare = new Nightmare({show: false});

async function scrapeCharityCompliance(categoryId, primarySector, subSector, linkId, pageNo, itemNo) {

    const max_attempts = 10;
    let retry = true;
    let result = {};

    for (let attempt_no = 1; attempt_no <= max_attempts && retry; attempt_no++) {
        console.log(`================================================`);
        console.log(`Processing code compliance: category ${categoryId}, page ${pageNo}, item ${itemNo}`);
        console.log(`Primary sector ${primarySector}, sub sector ${subSector}`);
        console.log(`Attempt No: ${attempt_no}`);
        console.log(`================================================`);

        let targetItemLink = '';

        try {
            console.log(`Loading main page`);
            await nightmare
                .wait(3000)
                .goto(START)
                .wait('#ctl00_PlaceHolderMain_btnSearch')
                .inject('js', 'extra/inject_link.js')
                .wait('#art1')
                .wait(linkId)
                .click(linkId)
                .inject('js', 'extra/inject.js')
                .wait('#a11');

            let targetPageLink = getTargetLink(pageNo);

            // click page link if it is not selected
            if (targetPageLink !== '') {
                console.log(`click page link ${targetPageLink} if it is not selected`);
                await nightmare
                    .wait(targetPageLink)
                    .click(targetPageLink)
                    .wait(3000);
            }

            console.log(`Capturing targetItemLink`);
            targetItemLink = await nightmare
                .wait(`#ctl00_PlaceHolderMain_lstSearchResults_ctrl${itemNo}_hfViewDetails`)
                .evaluate((itemNo) => {
                    return document.querySelector(`#ctl00_PlaceHolderMain_lstSearchResults_ctrl${itemNo}_hfViewDetails`).value;
                }, itemNo)
                .then(itemLink => {
                    console.log(`Acquiring targetItemLink ${itemLink}`);
                    return itemLink;
                });

            let mainData = {
                'category_id': categoryId,
                'primary_sector': primarySector,
                'sub_setor': subSector
            };

            console.log(`Acquiring main profile information`);
            mainData = await nightmare
                .goto(targetItemLink)
                .wait('#ctl00_PlaceHolderMain_lblAddress')
                .evaluate((layoutMapping, mainData) => {
                    for (let item in layoutMapping) {
                        mainData[item] = document.querySelector(layoutMapping[item]).innerText;
                    }
                    return mainData;
                }, layoutProfileMapping, mainData);

            console.log(`Getting code of compliance evaluation period and status`);
            let item = await nightmare
                .click('#ctl00_PlaceHolderMain_Menu1n3 > table > tbody > tr > td > a')
                .wait(2000)
                .wait('#ctl00_PlaceHolderMain_lblFY01Status')
                .evaluate((mainData) => {
                    // this JavaScript way of deep copying an object
                    let tempData = JSON.parse(JSON.stringify(mainData));

                    // check the last year code compliance status
                    tempData['index'] = 1;
                    tempData['evaluation_period'] = document.querySelector(`#ctl00_PlaceHolderMain_lblFY01`).innerText;
                    tempData['evaluation_status'] = document.querySelector(`#ctl00_PlaceHolderMain_lblFY01Status`).innerText;

                    return tempData;
                }, mainData);

            if (item['evaluation_status'] === 'Received' || item['evaluation_status'] === 'Late') {
                console.log(`capturing charity compliance detail, period: ${item['evaluation_period']}, status: ${item['evaluation_status']}`);

                result = await nightmare
                    .wait('#ctl00_PlaceHolderMain_FY1_gvGECChecklist > tbody > tr:nth-child(4) > td:nth-child(4)')
                    .wait(3000)
                    .evaluate((layoutComplianceMapping, item) => {
                        let data = [];
                        data[0] = JSON.parse(JSON.stringify(item));
                        for (let key in layoutComplianceMapping) {
                            for (let sub_key in layoutComplianceMapping[key]) {
                                try {
                                    data[0][`${key}_${sub_key}`] = document.querySelector(layoutComplianceMapping[key][sub_key]).innerText.replace(/\s+/, "");
                                } catch (e) {
                                    data[0][`${key}_${sub_key}`] = '';
                                }
                            }
                        }
                        return data;
                    }, layoutComplianceMapping, item)
                    .then(data => {
                        const csvData = csvFormat(data.filter(i => i));
                        writeFileSync(`./data/detail/compliance_${linkId}_${pageNo}_${itemNo}.csv`, csvData, {encoding: 'utf8'});
                        console.log(`------------------------------------------------`);
                        console.log(`Finish writing charity compliance information`);
                        console.log(`File: ./data/detail/compliance_${linkId}_${pageNo}_${itemNo}.csv`);
                        retry = false;
                        return data;
                    });

                return result;
            } else {
                console.log(`------------------------------------------------`);
                console.log(`No charity compliance information`);
                return {};
            }

        } catch (e) {
            console.error(e);
        }
    }

    return result;
}

function main() {
    let index = 0;
    let jobs = [];

    const inputFile = readFileSync('./data/input_links_compliance.csv', {encoding: 'utf8'});

    let inputData = {};

    Papa.parse(inputFile, {
        header: true,
        complete: function (results) {
            inputData = results.data;
        }
    });

    // use this code to start from the specific category and page no //
    // ****************** in case of emergency ********************* //
    // index = 36;
    // ****************** in case of emergency ********************* //

    inputData.forEach(charitiesCategory => {
        let pageNo = 1;

        // use this code to start from the specific category and page no //
        // ****************** in case of emergency ********************* //
        // if (index === 36) {
        //     pageNo = 11;
        //     charitiesCategory['record_count'] -= (pageNo * charityPerPage);
        // }
        // ****************** in case of emergency ********************* //

        for (let i = 1; i <= charitiesCategory['record_count']; i++) {
            jobs.push({
                'index': index,
                'primary_sector': charitiesCategory['primary_sector'],
                'sub_sector': charitiesCategory['sub_sector'],
                'link_id': charitiesCategory['link_id'],
                'item_no': (i - 1) % 5,
                'page_no': pageNo
            });
            if (i % 5 === 0) {
                pageNo += 1;
            }
        }

        index += 1;
    });

    const jobQueue = jobs.reduce(async (queue, data) => {
        const dataArray = await queue;
        dataArray.push(await scrapeCharityCompliance(data['index'], data['primary_sector'], data['sub_sector'], data['link_id'], data['page_no'], data['item_no']));
        return dataArray;
    }, Promise.resolve([]));

    jobQueue.then((data) => {
        console.log(data);
    }).catch(e => console.error(e));
}

main();
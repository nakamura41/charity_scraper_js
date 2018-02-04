const {readFileSync, writeFileSync} = require('fs');
const {csvFormat} = require('d3-dsv');
const Nightmare = require('nightmare');
const Papa = require('papaparse');

const START = 'https://www.charities.gov.sg/_layouts/MCYSCPSearch/MCYSCPSearchCriteriaPage.aspx';
const charityPerPage = 5;

const inputFile = readFileSync('./data/input.csv', {encoding: 'utf8'});

let inputData = {};

Papa.parse(inputFile, {
    header: true,
    complete: function (results) {
        inputData = results.data;
    }
});

function calculatePageCount(recordNumber) {
    return Math.ceil(recordNumber / charityPerPage);
}

function getTargetLink(pageNo) {
    // charities.gov.sg has a very weird pagination system (1 => 16 => 26 => ...) ???
    return (pageNo !== 1 ? `#a${pageNo}` : '');
}

async function scrapeCharityPage(categoryId, categoryElementSelector, pageNo) {
    const nightmare = new Nightmare({show: false});
    let result = {};

    console.log(`------------------------------------------------`);
    console.log(`Processing category ${categoryId} page ${pageNo}`);
    console.log(`------------------------------------------------`);

    try {
        // Go to initial start page, navigate to Detail search
        console.log('Go to initial start page, navigate to Detail search');

        await nightmare
            .goto(START)
            .wait('#ctl00_PlaceHolderMain_btnSearch')
            .click(categoryElementSelector)
            .click('#ctl00_PlaceHolderMain_btnSearch')
            .wait('#a2')
            .inject('js', 'extra/inject.js');
    } catch (e) {
        console.error(e);
    }

    try {
        let targetLink = getTargetLink(pageNo);

        // click page link if it is not selected
        if (targetLink !== '') {
            console.log('click page link if it is not selected');
            await nightmare
                .wait(targetLink)
                .click(targetLink)
        }

        result = await nightmare
            .wait(4000)
            .evaluate(() => {
                const elementPlaceholder = '#ctl00_PlaceHolderMain_lstSearchResults';

                let data = [];
                let index = 0;
                for (let i = 0; i < 5; i++) {
                    const elementNo = 'ctrl' + i;
                    const element = elementPlaceholder + '_' + elementNo;
                    data[index] = {
                        'name': [document.querySelector(element + '_lblNameOfOrg')]
                            .map(el => el.innerText)[0],
                        'uen': [document.querySelector(element + '_lblUENNo')]
                            .map(el => el.innerText)[0],
                        'status': [document.querySelector(element + '_lblCharityStatus')]
                            .map(el => el.innerText)[0],
                        'date_of_reg': [document.querySelector(element + '_lblDateOfCharityReg')]
                            .map(el => el.innerText)[0],
                        'ipc_status': [document.querySelector(element + '_lblIPCStatus')]
                            .map(el => el.innerText)[0],
                        'ipc_period': [document.querySelector(element + '_lblIPCPeriodNo')]
                            .map(el => el.innerText)[0],
                        'address': [document.querySelector(element + '_lblAddress')]
                            .map(el => el.innerText)[0],
                        'website': [document.querySelector(element + '_lblOrgWebsite')]
                            .map(el => el.innerText)[0],
                        'primary_sector': [document.querySelector(element + '_lblSector')]
                            .map(el => el.innerText)[0]
                    };
                    index++;
                }

                return data;
            })
            .end()
            .then(data => {
                const csvData = csvFormat(data.filter(i => i));
                writeFileSync(`./data/main/output_${categoryId}_${pageNo}.csv`, csvData, {encoding: 'utf8'});
                console.log(`Finish Processing category ${categoryId} page ${pageNo}`);
                return data;
            });

        return result;
    } catch (err) {
        console.log(err);
    }
}

function main() {
    let jobs = [];
    let index = 0;
    inputData.forEach(function (item) {
        item['page_count'] = calculatePageCount(item['record_count']);
        for (let i = 1; i <= item['page_count']; i++) {
            jobs.push({'index': index, 'element': item['element'], 'page': i});
        }
        index++;
    });

    const jobQueue = jobs.reduce(async (queue, data) => {
        const dataArray = await queue;
        dataArray.push(await scrapeCharityPage(data['index'], data['element'], data['page']));
        return dataArray;
    }, Promise.resolve([]));

    jobQueue.catch(e => console.error(e));
}

main();
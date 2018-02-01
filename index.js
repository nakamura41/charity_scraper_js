const {readFileSync, writeFileSync} = require('fs');
const {csvFormat} = require('d3-dsv');
const Nightmare = require('nightmare');
const Papa = require('papaparse');

const START = 'https://www.charities.gov.sg/_layouts/MCYSCPSearch/MCYSCPSearchCriteriaPage.aspx';
const charityPerPage = 5;

const inputFile = readFileSync('./data/input.csv',
    {encoding: 'utf8'});

let inputData = {};
const skipTargetLinkElement = '#ctl00_PlaceHolderMain_spPager1 > a:nth-child(11)';

Papa.parse(inputFile, {
    header: true,
    complete: function (results) {
        inputData = results.data;
    }
});

function calculatePageCount(recordNumber) {
    return Math.ceil(recordNumber / charityPerPage);
}

function calculateSkipping(pageNo) {
    // charities.gov.sg has a very weird pagination system (1 => 16 => 26 => ...) ???
    let pageSkip = Math.ceil(pageNo / 10) - 1;
    let targetLinkElement = (pageNo !== 1 && Math.floor(pageNo % 10) !== 6 ? `#a${pageNo}` : '');

    let pageSkipTargetLink = [];
    for (let i = 1; i <= pageSkip; i++) {
        pageSkipTargetLink.push(`#a${i}6`);
    }
    return {pageSkip: pageSkip, pageSkipTargetLink: pageSkipTargetLink, targetLink: targetLinkElement};
}

async function scrapeCharityPage(categoryId, categoryElementSelector, pageNo) {
    const nightmare = new Nightmare({show: false});

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
    } catch (e) {
        console.error(e);
    }

    try {
        let pageSkippingData = calculateSkipping(pageNo);

        // skip to the next 10th page
        for (let i = 0; i < pageSkippingData['pageSkip']; i++) {
            let skipTargetLink = pageSkippingData['pageSkipTargetLink'][i];
            console.log(`skip to the next 10th page, target=${skipTargetLink}`);

            await nightmare
                .wait(skipTargetLink)
                .click(skipTargetLink);
        }

        // click page link if it is not selected
        console.log('click page link if it is not selected');

        if (pageSkippingData['targetLink'] !== '') {
            await nightmare
                .wait(pageSkippingData['targetLink'])
                .click(pageSkippingData['targetLink'])
        }

        await nightmare
            .wait(4000)
            .evaluate(() => {
                const elementPlaceholder = '#ctl00_PlaceHolderMain_lstSearchResults';

                var data = [];
                var index = 0;
                for (var i = 0; i < 5; i++) {
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
                writeFileSync(`./data/output_${categoryId}_${pageNo}.csv`, csvData, {encoding: 'utf8'});

                console.log(`Finish Processing category ${categoryId} page ${pageNo}`);
                return data;
            });
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
        await scrapeCharityPage(data['index'], data['element'], data['page']);
        dataArray.push(data);
        return dataArray;
    }, Promise.resolve([]));

    jobQueue.catch(e => console.error(e));
}

main();
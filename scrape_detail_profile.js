const {readFileSync, writeFileSync} = require('fs');
const {csvFormat} = require('d3-dsv');
const Nightmare = require('nightmare');
const Papa = require('papaparse');

const START = 'https://www.charities.gov.sg/_layouts/MCYSCPSearch/MCYSCPSearchCriteriaPage.aspx';
const charityPerPage = 5;

const inputFile = readFileSync('./data/input_links.csv', {encoding: 'utf8'});

let inputData = {};

Papa.parse(inputFile, {
    header: true,
    complete: function (results) {
        inputData = results.data;
    }
});

const layoutMapping = {
    'name': '#ctl00_PlaceHolderMain_LabelOrgName',
    'address': '#ctl00_PlaceHolderMain_lblAddress',
    'website': '#ctl00_PlaceHolderMain_hlWebsite',
    'email': '#ctl00_PlaceHolderMain_hlEmailAddress',
    'telephone_no': '#ctl00_PlaceHolderMain_lblTelephoneNo',
    'fax_no': '#ctl00_PlaceHolderMain_lblFaxNo',
    'contact_no': '#ctl00_PlaceHolderMain_lblContactPerson',
    'type_of_entity': '#ctl00_PlaceHolderMain_lblTypeofEntity',
    'uen': '#ctl00_PlaceHolderMain_lblUENNo',
    'status': '#ctl00_PlaceHolderMain_lblCharityStatus',
    'date_of_registration': '#ctl00_PlaceHolderMain_lblDateofcharityregitration',
    'ipc_status': '#ctl00_PlaceHolderMain_lblIPCStatus',
    'ipc_period': '#ctl00_PlaceHolderMain_lblIPCPeriodNo',
    'sector_administrator': '#ctl00_PlaceHolderMain_lblSectorAdministrator',
    'last_profile_update': '#ctl00_PlaceHolderMain_lblLastProfileupdate',
    'objectives': '#ctl00_PlaceHolderMain_lblObjective',
    'vision_mission': '#ctl00_PlaceHolderMain_lblVisionMission',
    'programs_activities': '#ctl00_PlaceHolderMain_lblProgramsActivities'
};

function calculatePageCount(recordNumber) {
    return Math.ceil(recordNumber / charityPerPage);
}

function getTargetLink(pageNo) {
    // charities.gov.sg has a very weird pagination system (1 => 16 => 26 => ...) ???
    return (pageNo !== 1 ? `#a${pageNo}` : '');
}

async function scrapeCharityProfile(categoryId, primarySector, subSector, linkId, pageNo, itemNo) {

    const max_attempts = 5;
    let success = false;
    let result = {};

    for (let attempt_no = 1; attempt_no <= max_attempts || success; attempt_no++) {
        console.log(`================================================`);
        console.log(`Processing organisation profile: category ${categoryId}, page ${pageNo}, item ${itemNo}`);
        console.log(`Primary sector ${primarySector}, sub sector ${subSector}`);
        console.log(`Attempt No: ${attempt_no}`);
        console.log(`================================================`);

        const nightmare = new Nightmare({show: false});
        let targetItemLink = '';

        let result = {};

        try {
            await nightmare
                .wait(3000)
                .goto(START)
                .wait('#ctl00_PlaceHolderMain_btnSearch')
                .inject('js', 'extra/inject_link.js')
                .wait(linkId)
                .click(linkId)
                .wait(3000)
                .inject('js', 'extra/inject.js')
                .wait('#a11');
        } catch (e) {
            console.error(e);
        }

        try {
            let targetPageLink = getTargetLink(pageNo);

            // click page link if it is not selected
            if (targetPageLink !== '') {
                console.log(`click page link ${targetPageLink} if it is not selected`);
                await nightmare
                    .wait(targetPageLink)
                    .click(targetPageLink)
                    .wait(3000)
            }
        } catch (e) {
            console.error(e);
        }

        try {
            let hiddenElement = `#ctl00_PlaceHolderMain_lstSearchResults_ctrl${itemNo}_hfViewDetails`;
            targetItemLink = await nightmare
                .wait(hiddenElement)
                .evaluate(hiddenElement => {
                    return document.querySelector(hiddenElement).value;
                }, hiddenElement)
                .then(itemLink => {
                    return itemLink;
                });
        } catch (e) {
            console.error(e);
        }

        try {
            let data = [{
                'category_id': categoryId,
                'primary_sector': primarySector,
                'sub_setor': subSector
            }];

            result = await nightmare
                .goto(targetItemLink)
                .wait('#ctl00_PlaceHolderMain_lblAddress')
                .evaluate((layoutMapping, data) => {
                    for (let item in layoutMapping) {
                        data[0][item] = document.querySelector(layoutMapping[item]).innerText;
                    }
                    return data;
                }, layoutMapping, data)
                .end()
                .then(data => {
                    const csvData = csvFormat(data.filter(i => i));
                    writeFileSync(`./data/detail/profile_${linkId}_${pageNo}_${itemNo}.csv`, csvData, {encoding: 'utf8'});
                    console.log(`------------------------------------------------`);
                    console.log(`Finish writing charity profile information`);
                    console.log(`File: ./data/detail/profile_${linkId}_${pageNo}_${itemNo}.csv`);
                    success = true;
                    return data;
                });

        } catch (e) {
            console.error(e);
        }
    }

    return result;
}

function main() {
    let index = 37;
    let jobs = [];

    inputData.forEach(charitiesCategory => {
        let pageNo = 1;
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
        dataArray.push(await scrapeCharityProfile(data['index'], data['primary_sector'], data['sub_sector'], data['link_id'], data['page_no'], data['item_no']));
        return dataArray;
    }, Promise.resolve([]));

    jobQueue.catch(e => console.error(e));
}

main();
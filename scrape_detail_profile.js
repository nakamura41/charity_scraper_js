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

    console.log(`------------------------------------------------`);
    console.log(`Processing category ${categoryId} page ${pageNo} item ${itemNo}`);
    console.log(`Primary sector ${primarySector} sub sector ${subSector}`);
    console.log(`------------------------------------------------`);

    const nightmare = new Nightmare({show: false});
    let targetItemLink = '';
    let result = {};
    try {
        await nightmare
            .goto(START)
            .wait('#ctl00_PlaceHolderMain_btnSearch')
            .inject('js', 'extra/inject_link.js')
            .wait(linkId)
            .click(linkId)
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
                .wait(4000)
        }

       targetItemLink = await nightmare
            .wait(`#ctl00_PlaceHolderMain_lstSearchResults_ctrl${itemNo}_hfViewDetails`)
            .evaluate((itemNo) => {
                return document.querySelector(`#ctl00_PlaceHolderMain_lstSearchResults_ctrl${itemNo}_hfViewDetails`).value;
            }, itemNo)
            .then(itemLink => {
                return itemLink;
            });
    } catch (e) {
        console.error(e);
    }

    try {

        result = await nightmare
            .goto(targetItemLink)
            .wait('#ctl00_PlaceHolderMain_lblAddress')
            .evaluate((layoutMapping) => {
                let data = {};
                for (let item in layoutMapping) {
                    data[item] = document.querySelector(layoutMapping[item]).innerText;
                }
                return data;
            }, layoutMapping)
            .end()
            .then((data) => {
                data['category_id'] = categoryId;
                data['primary_sector'] = primarySector;
                data['sub_sector'] = subSector;
                console.log(`------------------------------------------------`);
                console.log(`captured data`);
                console.log(data);
                return data;
            });

        return result;
    } catch (e) {
        console.error(e);
    }
}

function main() {
    let index = 0;
    let pageNo = 1;

    let charitiesCategory = inputData[index];
    console.log(charitiesCategory);

    charitiesCategory['page_count'] = calculatePageCount(charitiesCategory['record_count']);

    let jobs = [];
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

    const jobQueue = jobs.reduce(async (queue, data) => {
        const dataArray = await queue;
        dataArray.push(await scrapeCharityProfile(data['index'], data['primary_sector'], data['sub_sector'], data['link_id'], data['page_no'], data['item_no']));
        return dataArray;
    }, Promise.resolve([]));

    jobQueue.then(data => {
        const csvData = csvFormat(data.filter(i => i));
        writeFileSync(`./data/detail/profile_${charitiesCategory['link_id']}.csv`, csvData, {encoding: 'utf8'});

        console.log(`Finish Processing charities on primary sector ${charitiesCategory['primary_sector']} sub sector ${charitiesCategory['sub_sector']}`);
        return data;
    }).catch(e => console.error(e));
}

main();
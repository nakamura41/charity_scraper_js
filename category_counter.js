const { csvFormat } = require('d3-dsv');
const Nightmare = require('nightmare');
const { writeFileSync } = require('fs');

const START = 'https://www.charities.gov.sg/_layouts/MCYSCPSearch/MCYSCPSearchCriteriaPage.aspx';

const CharityCategories = [
    '#ctl00_PlaceHolderMain_rblSearchCategory_0',
    '#ctl00_PlaceHolderMain_rblSearchCategory_1',
    '#ctl00_PlaceHolderMain_rblSearchCategory_2',
    '#ctl00_PlaceHolderMain_rblSearchCategory_4'
];

async function ScrapeCharity(categoryElementSelector) {

    console.log(`Now checking ${categoryElementSelector}`);
    const nightmare = new Nightmare({show: false});

    try {
        const result = await nightmare
            .goto(START)
            .wait('#ctl00_PlaceHolderMain_btnSearch')
            .click(categoryElementSelector)
            .click('#ctl00_PlaceHolderMain_btnSearch')
            .wait('#ctl00_PlaceHolderMain_lstSearchResults_ctrl0_trSearchDataList')
            .evaluate(externalVariable => {
                let text = document.querySelector('#ctl00_PlaceHolderMain_lblSearchCount').innerText;
                let recordCount = parseInt(text.replace(' records found', ''));

                return {'element': externalVariable, 'record_count': recordCount};
            }, categoryElementSelector)
            .end();
        return result;
    } catch (e) {
        console.error(e);
    }
};

function main() {
    const series = CharityCategories.reduce(async (queue, elementSelector) => {
        const dataArray = await queue;
        dataArray.push(await ScrapeCharity(elementSelector));
        return dataArray;
    }, Promise.resolve([]));

    series.then(data => {
        const csvData = csvFormat(data.filter(i => i));
        writeFileSync('./data/input.csv', csvData, { encoding: 'utf8' });
    }).catch(e => console.error(e));
}

main();
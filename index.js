const { readFileSync, writeFileSync } = require('fs');
const { csvFormat } = require('d3-dsv');
const Nightmare = require('nightmare');

const START = 'https://www.charities.gov.sg/_layouts/MCYSCPSearch/MCYSCPSearchCriteriaPage.aspx';

async function getCharity() {
    const nightmare = new Nightmare({ show: false });

    // Go to initial start page, navigate to Detail search
    try {
        await nightmare
            .goto(START)
            .wait('#ctl00_PlaceHolderMain_btnSearch')
            .click('#ctl00_PlaceHolderMain_btnSearch');
    } catch(e) {
        console.error(e);
    }

    try {

        const result = await nightmare
            .wait('#ctl00_PlaceHolderMain_lstSearchResults_ctrl0_trSearchDataList')
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
            .end();
        return result;
    } catch(e) {
        console.error(e);
        return undefined;
    }
};

getCharity()
    .then(data => {
        const csvData = csvFormat(data.filter(i => i));
        writeFileSync('./output.csv', csvData, { encoding: 'utf8' })
    }).catch(e => console.error(e));
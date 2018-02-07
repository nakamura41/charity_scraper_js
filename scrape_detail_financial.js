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

const layoutFinancialMapping = {
    'fy1': {
        'financial_period': '#ctl00_PlaceHolderMain_gvFinancialInformation > tbody > tr:nth-child(2) > td:nth-child(1)',
        'receipts_total': '#ctl00_PlaceHolderMain_gvFinancialInformation > tbody > tr:nth-child(2) > td:nth-child(2)',
        'expenses_total': '#ctl00_PlaceHolderMain_gvFinancialInformation > tbody > tr:nth-child(2) > td:nth-child(3)',
        'financial_status': '#ctl00_PlaceHolderMain_gvFinancialInformation > tbody > tr:nth-child(2) > td:nth-child(5)',
        'receipts_donation_cash_tax_deductible': '#ctl00_PlaceHolderMain_ucFSDetails_income_td_cash_2',
        'receipts_donation_cash_non_tax_deductible': '#ctl00_PlaceHolderMain_ucFSDetails_income_ntd_cash_2',
        'receipts_donation_cash_total': '#ctl00_PlaceHolderMain_ucFSDetails_income_total_cash_2',
        'receipts_donation_kind_tax_deductible': '#ctl00_PlaceHolderMain_ucFSDetails_income_td_kind_2',
        'receipts_donation_kind_non_tax_deductible': '#ctl00_PlaceHolderMain_ucFSDetails_income_ntd_kind_2',
        'receipts_donation_kind_total': '#ctl00_PlaceHolderMain_ucFSDetails_income_total_kind_2',
        'receipts_government_grants': '#ctl00_PlaceHolderMain_ucFSDetails_income_gov_grants_2',
        'receipts_investment_income': '#ctl00_PlaceHolderMain_ucFSDetails_income_investment_2',
        'receipts_programme_fees': '#ctl00_PlaceHolderMain_ucFSDetails_income_program_fee_2',
        'receipts_others_income': '#ctl00_PlaceHolderMain_ucFSDetails_income_other_2',
        'capital_in_nature': '#ctl00_PlaceHolderMain_ucFSDetails_capital_in_nature_2',
        'expenses_fund_raising': '#ctl00_PlaceHolderMain_ucFSDetails_expenses_fr_2',
        'expenses_charitable_local': '#ctl00_PlaceHolderMain_ucFSDetails_expenses_cae_local_2',
        'expenses_charitable_overseas': '#ctl00_PlaceHolderMain_ucFSDetails_expenses_cae_overseas_2',
        'expenses_charitable_total': '#ctl00_PlaceHolderMain_ucFSDetails_expenses_total_cape_2',
        'expenses_others_total': '#ctl00_PlaceHolderMain_ucFSDetails_expenses_other_2',
        'other_info_donation_other_charities': '#ctl00_PlaceHolderMain_ucFSDetails_oi_dgs_reg_charity_2',
        'other_info_no_of_employees': '#ctl00_PlaceHolderMain_ucFSDetails_oi_employee_no_2',
        'other_info_total_employee_costs': '#ctl00_PlaceHolderMain_ucFSDetails_oi_total_employee_cost_2',
        'other_info_fund_raising_efficiency_ratio': '#ctl00_PlaceHolderMain_ucFSDetails_oi_fr_efficiency_ratio_2',
        'other_info_total_related_party_transactions': '#ctl00_PlaceHolderMain_ucFSDetails_oi_total_related_party_2',
        'balance_assets_land_building': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_land_building_2',
        'balance_assets_other_tangible': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_other_tangible_2',
        'balance_assets_investments': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_investments_2',
        'balance_assets_inventories': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_inventories_2',
        'balance_assets_accounts_receivables': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_accounts_receivables_2',
        'balance_assets_cash_deposits': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_cash_deposits_2',
        'balance_assets_other_assets': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_other_2',
        'balance_assets_total': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_total_2',
        'balance_funds_unrestricted': '#ctl00_PlaceHolderMain_ucFSDetails_bs_funds_unrestricted_2',
        'balance_funds_restricted': '#ctl00_PlaceHolderMain_ucFSDetails_bs_funds_restricted_2',
        'balance_funds_endowment': '#ctl00_PlaceHolderMain_ucFSDetails_bs_funds_endowment_2',
        'balance_funds_total': '#ctl00_PlaceHolderMain_ucFSDetails_bs_funds_total_2',
        'balance_liabilities_current': '#ctl00_PlaceHolderMain_ucFSDetails_bs_liabilities_current_2',
        'balance_liabilities_non_current': '#ctl00_PlaceHolderMain_ucFSDetails_bs_liabilities_longterm_2',
        'balance_liabilities_total': '#ctl00_PlaceHolderMain_ucFSDetails_bs_liabilities_total_2',
        'balance_funds_liabilities_total': '#ctl00_PlaceHolderMain_ucFSDetails_bs_funds_liabilities_total_2'
    },
    'fy2': {
        'financial_period': '#ctl00_PlaceHolderMain_gvFinancialInformation > tbody > tr:nth-child(3) > td:nth-child(1)',
        'receipts_total': '#ctl00_PlaceHolderMain_gvFinancialInformation > tbody > tr:nth-child(3) > td:nth-child(2)',
        'expenses_total': '#ctl00_PlaceHolderMain_gvFinancialInformation > tbody > tr:nth-child(3) > td:nth-child(3)',
        'financial_status': '#ctl00_PlaceHolderMain_gvFinancialInformation > tbody > tr:nth-child(3) > td:nth-child(5)',
        'receipts_donation_cash_tax_deductible': '#ctl00_PlaceHolderMain_ucFSDetails_income_td_cash_1',
        'receipts_donation_cash_non_tax_deductible': '#ctl00_PlaceHolderMain_ucFSDetails_income_ntd_cash_1',
        'receipts_donation_cash_total': '#ctl00_PlaceHolderMain_ucFSDetails_income_total_cash_1',
        'receipts_donation_kind_tax_deductible': '#ctl00_PlaceHolderMain_ucFSDetails_income_td_kind_1',
        'receipts_donation_kind_non_tax_deductible': '#ctl00_PlaceHolderMain_ucFSDetails_income_ntd_kind_1',
        'receipts_donation_kind_total': '#ctl00_PlaceHolderMain_ucFSDetails_income_total_kind_1',
        'receipts_government_grants': '#ctl00_PlaceHolderMain_ucFSDetails_income_gov_grants_1',
        'receipts_investment_income': '#ctl00_PlaceHolderMain_ucFSDetails_income_investment_1',
        'receipts_programme_fees': '#ctl00_PlaceHolderMain_ucFSDetails_income_program_fee_1',
        'receipts_others_income': '#ctl00_PlaceHolderMain_ucFSDetails_income_other_1',
        'capital_in_nature': '#ctl00_PlaceHolderMain_ucFSDetails_capital_in_nature_1',
        'expenses_fund_raising': '#ctl00_PlaceHolderMain_ucFSDetails_expenses_fr_1',
        'expenses_charitable_local': '#ctl00_PlaceHolderMain_ucFSDetails_expenses_cae_local_1',
        'expenses_charitable_overseas': '#ctl00_PlaceHolderMain_ucFSDetails_expenses_cae_overseas_1',
        'expenses_charitable_total': '#ctl00_PlaceHolderMain_ucFSDetails_expenses_total_cape_1',
        'expenses_others_total': '#ctl00_PlaceHolderMain_ucFSDetails_expenses_other_1',
        'other_info_donation_other_charities': '#ctl00_PlaceHolderMain_ucFSDetails_oi_dgs_reg_charity_1',
        'other_info_no_of_employees': '#ctl00_PlaceHolderMain_ucFSDetails_oi_employee_no_1',
        'other_info_total_employee_costs': '#ctl00_PlaceHolderMain_ucFSDetails_oi_total_employee_cost_1',
        'other_info_fund_raising_efficiency_ratio': '#ctl00_PlaceHolderMain_ucFSDetails_oi_fr_efficiency_ratio_1',
        'other_info_total_related_party_transactions': '#ctl00_PlaceHolderMain_ucFSDetails_oi_total_related_party_1',
        'balance_assets_land_building': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_land_building_1',
        'balance_assets_other_tangible': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_other_tangible_1',
        'balance_assets_investments': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_investments_1',
        'balance_assets_inventories': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_inventories_1',
        'balance_assets_accounts_receivables': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_accounts_receivables_1',
        'balance_assets_cash_deposits': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_cash_deposits_1',
        'balance_assets_other_assets': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_other_1',
        'balance_assets_total': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_total_1',
        'balance_funds_unrestricted': '#ctl00_PlaceHolderMain_ucFSDetails_bs_funds_unrestricted_1',
        'balance_funds_restricted': '#ctl00_PlaceHolderMain_ucFSDetails_bs_funds_restricted_1',
        'balance_funds_endowment': '#ctl00_PlaceHolderMain_ucFSDetails_bs_funds_endowment_1',
        'balance_funds_total': '#ctl00_PlaceHolderMain_ucFSDetails_bs_funds_total_1',
        'balance_liabilities_current': '#ctl00_PlaceHolderMain_ucFSDetails_bs_liabilities_current_1',
        'balance_liabilities_non_current': '#ctl00_PlaceHolderMain_ucFSDetails_bs_liabilities_longterm_1',
        'balance_liabilities_total': '#ctl00_PlaceHolderMain_ucFSDetails_bs_liabilities_total_1',
        'balance_funds_liabilities_total': '#ctl00_PlaceHolderMain_ucFSDetails_bs_funds_liabilities_total_1'
    },
    'fy3': {
        'financial_period': '#ctl00_PlaceHolderMain_gvFinancialInformation > tbody > tr:nth-child(4) > td:nth-child(1)',
        'receipts_total': '#ctl00_PlaceHolderMain_gvFinancialInformation > tbody > tr:nth-child(4) > td:nth-child(2)',
        'expenses_total': '#ctl00_PlaceHolderMain_gvFinancialInformation > tbody > tr:nth-child(4) > td:nth-child(3)',
        'financial_status': '#ctl00_PlaceHolderMain_gvFinancialInformation > tbody > tr:nth-child(4) > td:nth-child(5)',
        'receipts_donation_cash_tax_deductible': '#ctl00_PlaceHolderMain_ucFSDetails_income_td_cash_0',
        'receipts_donation_cash_non_tax_deductible': '#ctl00_PlaceHolderMain_ucFSDetails_income_ntd_cash_0',
        'receipts_donation_cash_total': '#ctl00_PlaceHolderMain_ucFSDetails_income_total_cash_0',
        'receipts_donation_kind_tax_deductible': '#ctl00_PlaceHolderMain_ucFSDetails_income_td_kind_0',
        'receipts_donation_kind_non_tax_deductible': '#ctl00_PlaceHolderMain_ucFSDetails_income_ntd_kind_0',
        'receipts_donation_kind_total': '#ctl00_PlaceHolderMain_ucFSDetails_income_total_kind_0',
        'receipts_government_grants': '#ctl00_PlaceHolderMain_ucFSDetails_income_gov_grants_0',
        'receipts_investment_income': '#ctl00_PlaceHolderMain_ucFSDetails_income_investment_0',
        'receipts_programme_fees': '#ctl00_PlaceHolderMain_ucFSDetails_income_program_fee_0',
        'receipts_others_income': '#ctl00_PlaceHolderMain_ucFSDetails_income_other_0',
        'capital_in_nature': '#ctl00_PlaceHolderMain_ucFSDetails_capital_in_nature_0',
        'expenses_fund_raising': '#ctl00_PlaceHolderMain_ucFSDetails_expenses_fr_0',
        'expenses_charitable_local': '#ctl00_PlaceHolderMain_ucFSDetails_expenses_cae_local_0',
        'expenses_charitable_overseas': '#ctl00_PlaceHolderMain_ucFSDetails_expenses_cae_overseas_0',
        'expenses_charitable_total': '#ctl00_PlaceHolderMain_ucFSDetails_expenses_total_cape_0',
        'expenses_others_total': '#ctl00_PlaceHolderMain_ucFSDetails_expenses_other_0',
        'other_info_donation_other_charities': '#ctl00_PlaceHolderMain_ucFSDetails_oi_dgs_reg_charity_0',
        'other_info_no_of_employees': '#ctl00_PlaceHolderMain_ucFSDetails_oi_employee_no_0',
        'other_info_total_employee_costs': '#ctl00_PlaceHolderMain_ucFSDetails_oi_total_employee_cost_0',
        'other_info_fund_raising_efficiency_ratio': '#ctl00_PlaceHolderMain_ucFSDetails_oi_fr_efficiency_ratio_0',
        'other_info_total_related_party_transactions': '#ctl00_PlaceHolderMain_ucFSDetails_oi_total_related_party_0',
        'balance_assets_land_building': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_land_building_0',
        'balance_assets_other_tangible': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_other_tangible_0',
        'balance_assets_investments': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_investments_0',
        'balance_assets_inventories': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_inventories_0',
        'balance_assets_accounts_receivables': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_accounts_receivables_0',
        'balance_assets_cash_deposits': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_cash_deposits_0',
        'balance_assets_other_assets': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_other_0',
        'balance_assets_total': '#ctl00_PlaceHolderMain_ucFSDetails_bs_assets_total_0',
        'balance_funds_unrestricted': '#ctl00_PlaceHolderMain_ucFSDetails_bs_funds_unrestricted_0',
        'balance_funds_restricted': '#ctl00_PlaceHolderMain_ucFSDetails_bs_funds_restricted_0',
        'balance_funds_endowment': '#ctl00_PlaceHolderMain_ucFSDetails_bs_funds_endowment_0',
        'balance_funds_total': '#ctl00_PlaceHolderMain_ucFSDetails_bs_funds_total_0',
        'balance_liabilities_current': '#ctl00_PlaceHolderMain_ucFSDetails_bs_liabilities_current_0',
        'balance_liabilities_non_current': '#ctl00_PlaceHolderMain_ucFSDetails_bs_liabilities_longterm_0',
        'balance_liabilities_total': '#ctl00_PlaceHolderMain_ucFSDetails_bs_liabilities_total_0',
        'balance_funds_liabilities_total': '#ctl00_PlaceHolderMain_ucFSDetails_bs_funds_liabilities_total_0'
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

async function scrapeCharityFinancial(categoryId, primarySector, subSector, linkId, pageNo, itemNo) {

    const max_attempts = 10;
    let retry = true;
    let result = {};

    for (let attempt_no = 1; attempt_no <= max_attempts && retry; attempt_no++) {
        console.log(`================================================`);
        console.log(`Processing financial information: category ${categoryId}, page ${pageNo}, item ${itemNo}`);
        console.log(`Primary sector ${primarySector}, sub sector ${subSector}`);
        console.log(`Attempt No: ${attempt_no}`);
        console.log(`================================================`);


        let targetItemLink = '';

        try {
            console.log(`Loading main page`);
            await nightmare
                .wait(8000)
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

            console.log(`Acquiring profile information`);
            mainData = await nightmare
                .goto(targetItemLink)
                .wait('#ctl00_PlaceHolderMain_lblAddress')
                .evaluate((layoutMapping, mainData) => {
                    for (let item in layoutMapping) {
                        mainData[item] = document.querySelector(layoutMapping[item]).innerText;
                    }
                    return mainData;
                }, layoutProfileMapping, mainData)
                .then(mainData => {
                    console.log('Managed to get profile information');
                    console.log(mainData);
                    return mainData;
                });

            let financial_information_exists = false;
            let latest_financial_period = '';

            console.log('Checking whether we can access financial information or not...');
            await nightmare
                .click('#ctl00_PlaceHolderMain_Menu1n1 > table > tbody > tr > td > a')
                .wait(6000)
                .evaluate(() => {
                    // check whether we can access financial information page
                    return document.querySelector('#ctl00_PlaceHolderMain_gvFinancialInformation > tbody > tr:nth-child(2) > td:nth-child(1)').innerText;
                })
                .then(data => {
                    latest_financial_period = data;
                    console.log(`latest financial period: ${latest_financial_period}`);
                    financial_information_exists = true;
                })
                .catch(e => {
                    console.log(`------------------------------------------------`);
                    console.log(`No accessible financial information`);
                    retry = false;
                });

            if (financial_information_exists) {
                console.log('Getting Financial Information');
                result = await nightmare
                    .evaluate((layoutFinancialMapping, mainData) => {
                        let data = [];
                        for (let key in layoutFinancialMapping) {
                            // this JavaScript way of deep copying an object
                            let tempData = JSON.parse(JSON.stringify(mainData));

                            // check the last year code compliance status
                            for (let sub_key in layoutFinancialMapping[key]) {
                                tempData['index'] = key;
                                try {
                                    tempData[sub_key] = document.querySelector(layoutFinancialMapping[key][sub_key]).innerText;
                                } catch (e) {
                                    tempData[sub_key] = 0;
                                }
                            }

                            data.push(tempData);
                        }

                        return data;
                    }, layoutFinancialMapping, mainData)
                    .then(data => {
                        const csvData = csvFormat(data.filter(i => i));
                        writeFileSync(`./data/detail/financial_${linkId}_${pageNo}_${itemNo}.csv`, csvData, {encoding: 'utf8'});
                        console.log(`------------------------------------------------`);
                        console.log(`Finish writing charity financial information`);
                        console.log(`File: ./data/detail/financial_${linkId}_${pageNo}_${itemNo}.csv`);
                        retry = false;
                        return data;
                    });
            }

        }
        catch (e) {
            console.error(e);
        }
    }

    return result;
}

function main() {
    let index = 0;
    let jobs = [];

    const inputFile = readFileSync('./data/input_links_financial.csv', {encoding: 'utf8'});

    let inputData = {};

    Papa.parse(inputFile, {
        header: true,
        complete: function (results) {
            inputData = results.data;
        }
    });

    // use this code to restart from the specific category and page no //
    // ****************** in case of emergency ********************* //
    // index = 3;
    // ****************** in case of emergency ********************* //

    inputData.forEach(charitiesCategory => {
        let pageNo = 1;

        // use this code to restart from the specific category and page no //
        // ****************** in case of emergency ********************* //
        // if (index === 3) {
        //     pageNo = 4;
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
        dataArray.push(await scrapeCharityFinancial(data['index'], data['primary_sector'], data['sub_sector'], data['link_id'], data['page_no'], data['item_no']));
        return dataArray;
    }, Promise.resolve([]));

    jobQueue.then((data) => {
        console.log(data);
    }).catch(e => console.error(e));
}

main();
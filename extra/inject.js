let element = document.querySelector('#ctl00_PlaceHolderMain_spPager1');
for (let i = 11; i <= 600; i++) {
    let childElement = element.appendChild(document.createElement('a'));
    childElement.innerText = `${i}`;
    childElement.id = `a${i}`;
    childElement.href = `javascript:turnPage(${i})`;
    let childElement2 = element.appendChild(document.createElement('span'));
    childElement2.innerText = ' ';
}

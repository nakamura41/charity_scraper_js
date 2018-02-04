let element = document.querySelector('#ctl00_PlaceHolderMain_ULSector');

const links = [
    {
        'id': 'art1',
        'href': `javascript:SearchBySectorClass('9e73b6ff-86a2-e211-b716-005056b30ba7','e47ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'Historical & Cultural Conservation'
    },
    {
        'id': 'art2',
        'href': `javascript:SearchBySectorClass('9e73b6ff-86a2-e211-b716-005056b30ba7','c47ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'Literary Arts'
    },
    {
        'id': 'art3',
        'href': `javascript:SearchBySectorClass('9e73b6ff-86a2-e211-b716-005056b30ba7','9c7ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'Music & Orchestras'
    },
    {
        'id': 'art4',
        'href': `javascript:SearchBySectorClass('9e73b6ff-86a2-e211-b716-005056b30ba7','b07ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'Professional, Contemporary & Ethnic Dance'
    },
    {
        'id': 'art5',
        'href': `javascript:SearchBySectorClass('9e73b6ff-86a2-e211-b716-005056b30ba7','787ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'Theatre & Dramatic Arts'
    },
    {
        'id': 'art6',
        'href': `javascript:SearchBySectorClass('9e73b6ff-86a2-e211-b716-005056b30ba7','8e7ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'Traditional Ethnic Performing Arts'
    },
    {
        'id': 'art7',
        'href': `javascript:SearchBySectorClass('9e73b6ff-86a2-e211-b716-005056b30ba7','e27ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'Training & Education'
    },
    {
        'id': 'art8',
        'href': `javascript:SearchBySectorClass('9e73b6ff-86a2-e211-b716-005056b30ba7','b27ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'Visual Arts'
    },
    {
        'id': 'art9',
        'href': `javascript:SearchBySectorClass('9e73b6ff-86a2-e211-b716-005056b30ba7','b87ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'Others'
    },
    {
        'id': 'com1',
        'href': `javascript:SearchBySectorClass('7a479520-87a2-e211-b716-005056b30ba7','c07ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'South West'
    },
    {
        'id': 'com2',
        'href': `javascript:SearchBySectorClass('7a479520-87a2-e211-b716-005056b30ba7','aa7ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'North West'
    },
    {
        'id': 'com3',
        'href': `javascript:SearchBySectorClass('7a479520-87a2-e211-b716-005056b30ba7','7c7ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'Central'
    },
    {
        'id': 'com4',
        'href': `javascript:SearchBySectorClass('7a479520-87a2-e211-b716-005056b30ba7','a87ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'North East'
    },
    {
        'id': 'com5',
        'href': `javascript:SearchBySectorClass('7a479520-87a2-e211-b716-005056b30ba7','be7ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'South East'
    },
    {
        'id': 'edu1',
        'href': `javascript:SearchBySectorClass('4a0860ef-86a2-e211-b716-005056b30ba7','7a7ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'Local Educational Institutions/Funds'
    },
    {
        'id': 'edu2',
        'href': `javascript:SearchBySectorClass('4a0860ef-86a2-e211-b716-005056b30ba7','967ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'Foreign Educational Institutions/Funds'
    },
    {
        'id': 'edu3',
        'href': `javascript:SearchBySectorClass('4a0860ef-86a2-e211-b716-005056b30ba7','a67ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'Foundations & Trusts'
    },
    {
        'id': 'edu4',
        'href': `javascript:SearchBySectorClass('4a0860ef-86a2-e211-b716-005056b30ba7','e67ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'Uniformed Groups'
    },
    {
        'id': 'edu5',
        'href': `javascript:SearchBySectorClass('4a0860ef-86a2-e211-b716-005056b30ba7','e87ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'Government-Aided Schools'
    },
    {
        'id': 'edu6',
        'href': `javascript:SearchBySectorClass('4a0860ef-86a2-e211-b716-005056b30ba7','ea7ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'Independent Schools'
    },
    {
        'id': 'edu7',
        'href': `javascript:SearchBySectorClass('4a0860ef-86a2-e211-b716-005056b30ba7','b67ffebd-c9b4-e211-8dc7-005056af4193');`,
        'text': 'Others'
    },
    {
        'id': 'hea1',
        'href': `javascript:SearchBySectorClass('b2723ee6-86a2-e211-b716-005056b30ba7','f29bd899-e0f2-e211-b9c1-005056b30ba7');`,
        'text': 'Cluster/Hospital Funds'
    },
    {
        'id': 'hea2',
        'href': `javascript:SearchBySectorClass('b2723ee6-86a2-e211-b716-005056b30ba7','4ecf69a5-e0f2-e211-b9c1-005056b30ba7');`,
        'text': 'Community/Chronic Sick Hospital'
    },
    {
        'id': 'hea3',
        "href": "javascript:SearchBySectorClass('b2723ee6-86a2-e211-b716-005056b30ba7','af5390ac-e0f2-e211-b9c1-005056b30ba7');",
        "text": "Day Rehabilitation Centre"
    },
    {
        'id': 'hea4',
        "href": "javascript:SearchBySectorClass('b2723ee6-86a2-e211-b716-005056b30ba7','8c7ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Diseases/Illnessess Support Group"
    },
    {
        'id': 'hea5',
        "href": "javascript:SearchBySectorClass('b2723ee6-86a2-e211-b716-005056b30ba7','b05390ac-e0f2-e211-b9c1-005056b30ba7');",
        "text": "Home Care"
    },
    {
        'id': 'hea6',
        "href": "javascript:SearchBySectorClass('b2723ee6-86a2-e211-b716-005056b30ba7','cf64c3b8-e0f2-e211-b9c1-005056b30ba7');",
        "text": "Hospice"
    },
    {
        'id': 'hea7',
        "href": "javascript:SearchBySectorClass('b2723ee6-86a2-e211-b716-005056b30ba7','eb7df9be-e0f2-e211-b9c1-005056b30ba7');",
        "text": "Hospital/Statutory Board"
    },
    {
        'id': 'hea8',
        "href": "javascript:SearchBySectorClass('b2723ee6-86a2-e211-b716-005056b30ba7','ec7df9be-e0f2-e211-b9c1-005056b30ba7');",
        "text": "Nursing Home"
    },
    {
        'id': 'hea9',
        "href": "javascript:SearchBySectorClass('b2723ee6-86a2-e211-b716-005056b30ba7','550d75cc-e0f2-e211-b9c1-005056b30ba7');",
        "text": "Other Community-based Services"
    },
    {
        'id': 'hea10',
        "href": "javascript:SearchBySectorClass('b2723ee6-86a2-e211-b716-005056b30ba7','501d41d3-e0f2-e211-b9c1-005056b30ba7');",
        "text": "Palliative Home Care"
    },
    {
        'id': 'hea11',
        "href": "javascript:SearchBySectorClass('b2723ee6-86a2-e211-b716-005056b30ba7','511d41d3-e0f2-e211-b9c1-005056b30ba7');",
        "text": "Health Professional Group"
    },
    {
        'id': 'hea12',
        "href": "javascript:SearchBySectorClass('b2723ee6-86a2-e211-b716-005056b30ba7','6ff0f4dd-e0f2-e211-b9c1-005056b30ba7');",
        "text": "Renal Dialysis"
    },
    {
        'id': 'hea13',
        "href": "javascript:SearchBySectorClass('b2723ee6-86a2-e211-b716-005056b30ba7','70f0f4dd-e0f2-e211-b9c1-005056b30ba7');",
        "text": "TCM Clinic"
    },
    {
        'id': 'hea14',
        "href": "javascript:SearchBySectorClass('b2723ee6-86a2-e211-b716-005056b30ba7','4660fde7-e0f2-e211-b9c1-005056b30ba7');",
        "text": "Trust/Research Funds"
    },
    {
        'id': 'hea15',
        "href": "javascript:SearchBySectorClass('b2723ee6-86a2-e211-b716-005056b30ba7','4760fde7-e0f2-e211-b9c1-005056b30ba7');",
        "text": "Others"
    },
    {
        'id': 'rel1',
        "href": "javascript:SearchBySectorClass('1ed69f16-87a2-e211-b716-005056b30ba7','c87ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Buddhism"
    },
    {
        'id': 'rel2',
        "href": "javascript:SearchBySectorClass('1ed69f16-87a2-e211-b716-005056b30ba7','f0d42b7b-95a3-e311-93ea-005056b30485');",
        "text": "Christianity"
    },
    {
        'id': 'rel3',
        "href": "javascript:SearchBySectorClass('1ed69f16-87a2-e211-b716-005056b30ba7','cc7ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Hinduism"
    },
    {
        'id': 'rel4',
        "href": "javascript:SearchBySectorClass('1ed69f16-87a2-e211-b716-005056b30ba7','ce7ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Islam"
    },
    {
        'id': 'rel5',
        "href": "javascript:SearchBySectorClass('1ed69f16-87a2-e211-b716-005056b30ba7','d07ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Taoism"
    },
    {
        'id': 'rel6',
        "href": "javascript:SearchBySectorClass('1ed69f16-87a2-e211-b716-005056b30ba7','d27ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Others"
    },
    {
        "id": "soc1",
        "href": "javascript:SearchBySectorClass('a2bdf80e-87a2-e211-b716-005056b30ba7','7e7ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Children/Youth"
    },
    {
        "id": "soc2",
        "href": "javascript:SearchBySectorClass('a2bdf80e-87a2-e211-b716-005056b30ba7','887ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Disability (Children)"
    },
    {
        "id": "soc3",
        "href": "javascript:SearchBySectorClass('a2bdf80e-87a2-e211-b716-005056b30ba7','867ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Disability (Adult)"
    },
    {
        "id": "soc4",
        "href": "javascript:SearchBySectorClass('a2bdf80e-87a2-e211-b716-005056b30ba7','907ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Eldercare"
    },
    {
        "id": "soc5",
        "href": "javascript:SearchBySectorClass('a2bdf80e-87a2-e211-b716-005056b30ba7','947ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Family"
    },
    {
        "id": "soc6",
        "href": "javascript:SearchBySectorClass('a2bdf80e-87a2-e211-b716-005056b30ba7','c27ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Support Groups"
    },
    {
        "id": "soc7",
        "href": "javascript:SearchBySectorClass('a2bdf80e-87a2-e211-b716-005056b30ba7','807ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Community"
    },
    {
        "id": "spo1",
        "href": "javascript:SearchBySectorClass('062fad64-87a2-e211-b716-005056b30ba7','ac7ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "NSAs"
    },
    {
        "id": "spo2",
        "href": "javascript:SearchBySectorClass('062fad64-87a2-e211-b716-005056b30ba7','d47ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Non-NSAs"
    },
    {
        "id": "spo3",
        "href": "javascript:SearchBySectorClass('062fad64-87a2-e211-b716-005056b30ba7','d67ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Disability Sports"
    },
    {
        "id": "spo4",
        "href": "javascript:SearchBySectorClass('062fad64-87a2-e211-b716-005056b30ba7','d87ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Competitive Sports"
    },
    {
        "id": "spo5",
        "href": "javascript:SearchBySectorClass('062fad64-87a2-e211-b716-005056b30ba7','da7ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Mind Sports"
    },
    {
        "id": "spo6",
        "href": "javascript:SearchBySectorClass('062fad64-87a2-e211-b716-005056b30ba7','dc7ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Trust Funds"
    },
    {
        "id": "spo7",
        "href": "javascript:SearchBySectorClass('062fad64-87a2-e211-b716-005056b30ba7','de7ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Youth Sports"
    },
    {
        "id": "spo8",
        "href": "javascript:SearchBySectorClass('062fad64-87a2-e211-b716-005056b30ba7','ba7ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Others"
    },
    {
        "id": "oth1",
        "href": "javascript:SearchBySectorClass('1e89064e-aba1-e211-9d84-005056a402dc','767ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Animal Welfare"
    },
    {
        "id": "oth2",
        "href": "javascript:SearchBySectorClass('1e89064e-aba1-e211-9d84-005056a402dc','a47ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Children/Youth"
    },
    {
        "id": "oth3",
        "href": "javascript:SearchBySectorClass('1e89064e-aba1-e211-9d84-005056a402dc','927ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Environment"
    },
    {
        "id": "oth4",
        "href": "javascript:SearchBySectorClass('1e89064e-aba1-e211-9d84-005056a402dc','c67ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Humanitarian Aid"
    },
    {
        "id": "oth5",
        "href": "javascript:SearchBySectorClass('1e89064e-aba1-e211-9d84-005056a402dc','bc7ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Self-Help Groups"
    },
    {
        "id": "oth6",
        "href": "javascript:SearchBySectorClass('1e89064e-aba1-e211-9d84-005056a402dc','8a7ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "Think Tanks"
    },
    {
        "id": "oth7",
        "href": "javascript:SearchBySectorClass('1e89064e-aba1-e211-9d84-005056a402dc','987ffebd-c9b4-e211-8dc7-005056af4193');",
        "text": "General Charitable Purposes"
    }
];

links.forEach(function (item) {
    let childElement = element.appendChild(document.createElement('li'));
    let aElement = childElement.appendChild(document.createElement('a'));
    aElement.innerText = item['text'];
    aElement.id = item['id'];
    aElement.href = item['href'];
});

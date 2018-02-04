let element = document.querySelector('#ctl00_PlaceHolderMain_ULSector');

const links = [
    {
        'id': 'art1',
        'text': 'Historical & Cultural Conservation',
        'href': `javascript:SearchBySectorClass('9e73b6ff-86a2-e211-b716-005056b30ba7','e47ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'art2',
        'text': 'Literary Arts',
        'href': `javascript:SearchBySectorClass('9e73b6ff-86a2-e211-b716-005056b30ba7','c47ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'art3',
        'text': 'Music & Orchestras',
        'href': `javascript:SearchBySectorClass('9e73b6ff-86a2-e211-b716-005056b30ba7','9c7ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'art4',
        'text': 'Professional, Contemporary & Ethnic Dance',
        'href': `javascript:SearchBySectorClass('9e73b6ff-86a2-e211-b716-005056b30ba7','b07ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'art5',
        'text': 'Theatre & Dramatic Arts',
        'href': `javascript:SearchBySectorClass('9e73b6ff-86a2-e211-b716-005056b30ba7','787ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'art6',
        'text': 'Traditional Ethnic Performing Arts',
        'href': `javascript:SearchBySectorClass('9e73b6ff-86a2-e211-b716-005056b30ba7','8e7ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'art7',
        'text': 'Training & Education',
        'href': `javascript:SearchBySectorClass('9e73b6ff-86a2-e211-b716-005056b30ba7','e27ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'art8',
        'text': 'Visual Arts',
        'href': `javascript:SearchBySectorClass('9e73b6ff-86a2-e211-b716-005056b30ba7','b27ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'art9',
        'text': 'Others',
        'href': `javascript:SearchBySectorClass('9e73b6ff-86a2-e211-b716-005056b30ba7','b87ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'com1',
        'text': 'South West',
        'href': `javascript:SearchBySectorClass('7a479520-87a2-e211-b716-005056b30ba7','c07ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'com2',
        'text': 'North West',
        'href': `javascript:SearchBySectorClass('7a479520-87a2-e211-b716-005056b30ba7','aa7ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'com3',
        'text': 'Central',
        'href': `javascript:SearchBySectorClass('7a479520-87a2-e211-b716-005056b30ba7','7c7ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'com4',
        'text': 'North East',
        'href': `javascript:SearchBySectorClass('7a479520-87a2-e211-b716-005056b30ba7','a87ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'com5',
        'text': 'South East',
        'href': `javascript:SearchBySectorClass('7a479520-87a2-e211-b716-005056b30ba7','be7ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'edu1',
        'text': 'Local Educational Institutions/Funds',
        'href': `javascript:SearchBySectorClass('4a0860ef-86a2-e211-b716-005056b30ba7','7a7ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'edu2',
        'text': 'Foreign Educational Institutions/Funds',
        'href': `javascript:SearchBySectorClass('4a0860ef-86a2-e211-b716-005056b30ba7','967ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'edu3',
        'text': 'Foundations & Trusts',
        'href': `javascript:SearchBySectorClass('4a0860ef-86a2-e211-b716-005056b30ba7','a67ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'edu4',
        'text': 'Uniformed Groups',
        'href': `javascript:SearchBySectorClass('4a0860ef-86a2-e211-b716-005056b30ba7','e67ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'edu5',
        'text': 'Government-Aided Schools',
        'href': `javascript:SearchBySectorClass('4a0860ef-86a2-e211-b716-005056b30ba7','e87ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'edu6',
        'text': 'Independent Schools',
        'href': `javascript:SearchBySectorClass('4a0860ef-86a2-e211-b716-005056b30ba7','ea7ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'edu7',
        'text': 'Others',
        'href': `javascript:SearchBySectorClass('4a0860ef-86a2-e211-b716-005056b30ba7','b67ffebd-c9b4-e211-8dc7-005056af4193');`
    },
    {
        'id': 'hea1',
        'text': 'Cluster/Hospital Funds',
        'href': `javascript:SearchBySectorClass('b2723ee6-86a2-e211-b716-005056b30ba7','f29bd899-e0f2-e211-b9c1-005056b30ba7');`
    },
    {
        'id': 'hea2',
        'text': 'Community/Chronic Sick Hospital',
        'href': `javascript:SearchBySectorClass('b2723ee6-86a2-e211-b716-005056b30ba7','4ecf69a5-e0f2-e211-b9c1-005056b30ba7');`
    },
    {
        'id': 'hea3',
        'text': '',
        'href': ``
    },
    {
        'id': 'hea4',
        'text': '',
        'href': ``
    },
    {
        'id': 'hea5',
        'text': '',
        'href': ``
    },
    {
        'id': 'hea6',
        'text': '',
        'href': ``
    },
    {
        'id': 'hea7',
        'text': '',
        'href': ``
    },
    {
        'id': 'hea8',
        'text': '',
        'href': ``
    },
    {
        'id': 'hea9',
        'text': '',
        'href': ``
    },
    {
        'id': 'hea10',
        'text': '',
        'href': ``
    },
    {
        'id': 'hea11',
        'text': '',
        'href': ``
    },
    {
        'id': 'hea12',
        'text': '',
        'href': ``
    },
    {
        'id': 'hea13',
        'text': '',
        'href': ``
    },
    {
        'id': 'hea14',
        'text': '',
        'href': ``
    },
    {
        'id': 'hea15',
        'text': '',
        'href': ``
    }
];

links.forEach(function (item) {
    let childElement = element.appendChild(document.createElement('li'));
    let aElement = childElement.appendChild(document.createElement('a'));
    aElement.innerText = item['text'];
    aElement.id = item['id'];
    aElement.href = item['href'];
});

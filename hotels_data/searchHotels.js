const loginHandler = require('../utilities/loginHandler');
const selectDate = require('../utilities/selectDate');
const hotelDataScrap = require('./hotelDataScrap');
const fs = require('fs');

async function searchHotels(tab){
    await tab.goto("https://www.makemytrip.com/hotels/");
    await loginHandler(tab);

    await tab.waitForSelector('[data-cy="city"]', {visible: true});
    await tab.click('[data-cy="city"]');

    let placeObj = fs.readFileSync('./utilities/placeNames.json', {encoding: 'utf-8'});
    placeObj = JSON.parse(placeObj);

    await tab.waitForSelector('input[autocomplete]', {visible: true});
    await tab.type('input[autocomplete]', placeObj.toPlace, {delay: 50});

    await tab.waitForTimeout(500);

    let toCity = await tab.$('#react-autowhatever-1 li');
    if(toCity == null){
        toCity = await tab.$('#react-autowhatever-1 .spaceBetween.makeFlex.hrtlCenter.regionLists');
    }

    await toCity.click();

    await tab.waitForTimeout(500);

    let dateObj = fs.readFileSync('./utilities/date.json',{encoding: 'utf-8'})
    dateObj = JSON.parse(dateObj);
    let date = dateObj.date;

    await selectDate(tab, date);

    await tab.waitForSelector('div.hsBackDrop', {visible: true})
    
    await tab.evaluate(function(){
        let outClick = document.querySelector('div.hsBackDrop');
        outClick.click();
    });

    await Promise.all([
        tab.click('[data-cy="submit"]'),
        tab.waitForNavigation()
    ]);

    await hotelDataScrap(tab);
}

module.exports = searchHotels;

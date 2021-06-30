const loginHandler = require('../utilities/loginHandler');
const selectDate = require('../utilities/selectDate');
const hotelDataScrap = require('./hotelDataScrap');


async function searchHotels(tab){
    await tab.goto("https://www.makemytrip.com/hotels/");
    await loginHandler(tab);

    await tab.waitForSelector('[data-cy="city"]', {visible: true});
    await tab.click('[data-cy="city"]');

    await tab.waitForSelector('input[autocomplete]', {visible: true});
    await tab.type('input[autocomplete]', "lucknow", {delay: 50});

    await tab.waitForTimeout(500);

    let toCity = await tab.$('#react-autowhatever-1 li');
    await toCity.click();

    await tab.waitForTimeout(500);

    await selectDate(tab);

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

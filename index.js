const pup = require('puppeteer');

//We will get searchTrains() function on requiring this file.
//This function helps to search Trains and fetch details about them.
const searchTrains = require('./train_data/searchTrains');

const searchHotels = require('./hotels_data/searchHotels');

const findTouristSpots = require('./tourist_spots/findTouristSpots');

(async function(){
    const browser = await pup.launch({
            headless:false,
            defaultViewport: null,
            args:['--start-maximized']
        });

    const tabs = await browser.pages();

    let tab1 = tabs[0];

    await searchTrains(tab1);    //calling the searchTrains() function and pass the opened tab of browser.

    let tab2 = await browser.newPage();

    await searchHotels(tab2);

    let tab3 = await browser.newPage();
    await findTouristSpots(tab3);

})();
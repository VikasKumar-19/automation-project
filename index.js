const pup = require('puppeteer');

//We will get searchTrains() function on requiring this file.
//This function helps to search Trains and fetch details about them.
const searchTrains = require('./train_data/searchTrains');
                                                           
(async function(){
    const browser = await pup.launch({
            headless:false,
            defaultViewport: null,
            args:['--start-maximized']
        });

    const tabs = await browser.pages();
    let tab = tabs[0];

    await searchTrains(tab);    //calling the searchTrains() function and pass the opened tab of browser.

})();
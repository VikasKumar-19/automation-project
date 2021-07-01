//We will get scrapTrainData() function on requiring this file.
//This function helps to fetch all the required data of available trains.
const scrapTrainData = require('./trainDataScrap');
const loginHandler = require('../utilities/loginHandler');
const selectDate = require('../utilities/selectDate');
const fs = require('fs');

async function searchTrains(tab){

    await tab.goto("https://www.makemytrip.com");

    await loginHandler(tab); //this function is handling the Login popup appears on opening the site.

    await tab.click('.menu_Trains');

    //Now we have to provide the details about user journey.

    //here we are entering the the user's location from where he will board the train.
    await tab.waitForSelector('[for="fromCity"]', {visible: true});

    await tab.click('[for="fromCity"]');

    let placeObj = fs.readFileSync('./utilities/placeNames.json', {encoding: 'utf-8'});
    placeObj = JSON.parse(placeObj);

    await tab.type('input[autocomplete="off"]', placeObj.fromPlace, {delay: 100});

    await tab.waitForTimeout(500);

    let fromCity = await tab.$('#react-autowhatever-1 li');
    await fromCity.click();

    
    await tab.waitForTimeout(1000);

    //here we are entering the the destination place where user want to go.
    await tab.type('input[autocomplete="off"]', placeObj.toPlace, {delay: 100});
    
    await tab.waitForTimeout(500);
    
    let toCity = await tab.$('#react-autowhatever-1 li');
    await toCity.click();

    await tab.waitForTimeout(1000);

    //we have called the function selectDate() which helps to select the date on calendar appears on the page.
    let dateObj = fs.readFileSync('./utilities/date.json',{encoding: 'utf-8'})
    dateObj = JSON.parse(dateObj);
    let date = dateObj.date;

    await selectDate(tab, date);

    //we have selected All Classes option which helps to search available trains with all classes.
    let classType = await tab.$('ul.travelForPopup li');
    await classType.click();
    
    //this will perform the search operation and navigation.
    await Promise.all([
        tab.click('a[data-cy="submit"]'),
        tab.waitForNavigation()
    ]);
        
    //After the navigation we will reach to the new page from where we can get the details of available trains.

    await scrapTrainData(tab); //This function calling will fetch all the required details of the available trains.
}

module.exports = searchTrains;
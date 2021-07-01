const fs = require('fs');

async function findTouristspots(tab){
    await tab.goto("https://www.google.com/travel");

    let placeObj = fs.readFileSync('./utilities/placeNames.json',{encoding: 'utf-8'})
    placeObj = JSON.parse(placeObj);
   
    await tab.type('#oA4zhb', placeObj.toPlace);

    await Promise.all([
        tab.keyboard.press('Enter'),
        tab.waitForNavigation()
    ]);

    await tab.waitForSelector('.sUF6Ec .kQb6Eb');

    let topSpotsSection = await tab.$('.sUF6Ec .kQb6Eb');

    // console.log(topSpotsSection);

    let allPlacesData = [];

    let allPlaces = await topSpotsSection.$$('.f4hh3d');

    for(let i = 0; i < 5 && i < allPlaces.length; i++){

        await tab.waitForTimeout(500);
        
        let singlePlacedata = await tab.evaluate(function(singlePlace){

            let placeName = singlePlace.querySelector('.rbj0Ud').textContent;
            let placeDesc = singlePlace.querySelector('.nFoFM').textContent;
            let image = singlePlace.querySelector('.R1Ybne.YH2pd');

            singlePlace.scrollIntoView({behavior: "smooth"});
            
            return {
                placeName,
                placeDesc,
                imageURL: image.src
            }

        }, allPlaces[i]);

        allPlacesData.push(singlePlacedata);
    }

    console.log(allPlacesData);

    fs.writeFileSync('./touristSpots.json', JSON.stringify(allPlacesData)); 
}

module.exports = findTouristspots;
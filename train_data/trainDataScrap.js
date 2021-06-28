const fs = require('fs')
async function scrapTrainData(tab){

    let allTrainsData = [];
    await tab.waitForSelector('.single-train-detail', {visible: true})
    let allTrains = await tab.$$('.single-train-detail');
    console.log(allTrains.length);

    for(let i = 0; i < 3 && i < allTrains.length; i++){
        trainData = await tab.evaluate(function(train){

            let trainName = train.querySelector('.train-name');
            let trainDeptNo = train.querySelector('.flex.train-depart-number div');
            let departTime = train.querySelector('.depart-time');
            let fromStation = departTime.nextSibling.textContent;
            let arrivalTime = train.querySelector('.arrival-time');
            let toStation = arrivalTime.nextSibling.textContent;

            function checkAndUpdate(card){ // this will update the status of availability of the particular class of the selected train.
                try{
                    let btn = card.querySelector('.update-info-button');
                    btn.click();
                    return 1;
                }
                catch(err){
                    return -1;
                }
            }

            let availRailClasses = [];

            let availableClasses = train.querySelectorAll('.card');

            for(let j = 0; j < availableClasses.length; j++){

                let btnFound = checkAndUpdate(availableClasses[j]);
                
                if(btnFound == 1){
                    let currentTime = new Date().getTime();
                    while (currentTime + 5000 >= new Date().getTime()){
                    }
                }

                let railClass = availableClasses[j].querySelector('.rail-class').textContent;
                let railPrice = availableClasses[j].querySelector('.ticket-price').textContent;
                let available = availableClasses[j].querySelector('.availibilty-info').textContent;
                
                available = available.split(" ")[1];

                availRailClasses.push({
                    railClassName: railClass,
                    ticketPrice: railPrice,
                    availableSeats: available
                })
            }

            return {
                trainName : trainName.textContent,
                trainDeptNo: trainDeptNo.textContent,
                departTime: departTime.textContent,
                arrivalTime: arrivalTime.textContent,
                fromStaion: fromStation,
                toStation: toStation,
                railClass: availRailClasses
            }

        }, allTrains[i])

        allTrainsData.push(trainData);
    }

    console.log(allTrainsData);
    // fs.writeFileSync('./trainsData.json', JSON.stringify(allTrainsData)); // json file
}

module.exports = scrapTrainData;
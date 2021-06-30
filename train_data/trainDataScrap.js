const fs = require('fs')
async function scrapTrainData(tab){

    let allTrainsData = [];
    await tab.waitForSelector('.single-train-detail', {visible: true})
    let allTrains = await tab.$$('.single-train-detail');

    for(let i = 0; i < 5 && i < allTrains.length; i++){

        await tab.waitForTimeout(500);

        trainData = await tab.evaluate(async function(train){

            let trainName = train.querySelector('.train-name');
            let trainDeptNo = train.querySelector('.flex.train-depart-number div');
            let departTime = train.querySelector('.depart-time');
            let fromStation = departTime.nextSibling.textContent;
            let arrivalTime = train.querySelector('.arrival-time');
            let toStation = arrivalTime.nextSibling.textContent;

            function checkAndUpdate(card){ // this will update the status of availability of the particular class of the selected train.
             
                let btn = card.querySelector('.update-info-button');
                if(btn == null){
                    return;
                }
                else{
                    btn.click();
                    return;
                }
               
            }

            let availRailClasses = [];

            let availableClasses = train.querySelectorAll('.card');

            for(let j = 0; j < availableClasses.length; j++){

                checkAndUpdate(availableClasses[j]);
                
                try{
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

                catch(err){
                    console.log(err.message);
                }
                
            }

            if(availRailClasses.length == 0){
                availRailClasses = "Not available";
            }

            train.scrollIntoView({behavior: "smooth"});

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
    fs.writeFileSync('./trainsData.json', JSON.stringify(allTrainsData)); // json file

}

module.exports = scrapTrainData;
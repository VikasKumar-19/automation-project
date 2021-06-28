//We will get scrapTrainData() function on requiring this file.
//This function helps to fetch all the required data of available trains.
const scrapTrainData = require('./trainDataScrap');

let date = "23 August 2021";

async function searchTrains(tab){

    await tab.goto("https://www.makemytrip.com/"); //this is the site used to fetch the details of trains

    await loginHandler(tab); //this function is handling the Login popup appears on opening the site.

    await tab.click('.menu_Trains');

    //Now we have to provide the details about user journey.

    //here we are entering the the user's location from where he will board the train.
    await tab.waitForSelector('[for="fromCity"]', {visible: true});

    await tab.click('[for="fromCity"]');

    await tab.type('input[autocomplete="off"]', "new delhi", {delay: 100});

    await tab.waitForTimeout(1000);

    let fromCity = await tab.$('#react-autowhatever-1 li');
    await fromCity.click();

    
    await tab.waitForTimeout(1000);

    //here we are entering the the destination place where user want to go.
    await tab.type('input[autocomplete="off"]', "lucknow", {delay: 100});
    let toCity = await tab.$('#react-autowhatever-1 li');

    await tab.waitForTimeout(1000);

    await toCity.click();

    await tab.waitForTimeout(1000);

    //we have called the function selectDate() which helps to select the date on calendar appears on the page.
    await selectDate(tab);

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


//this is a function which helps to handle the pop appears on first screen.
async function loginHandler(tab){
    try{
        await tab.click('.loginModal.displayBlock.modalLogin.dynHeight.personal');
    }
    catch(err){
        return;
    }
}

// this is a main function for selecting the date.
async function selectDate(tab){

    let dateArr = date.split(" ");
    let givenMonth = dateArr[1];
    let givenDay = dateArr[0];

    let monthsName = await tab.evaluate(function(){
        let monthList = document.querySelectorAll('.DayPicker-Months .DayPicker-Caption div');
        monthList = [...monthList];
        let arr = monthList.map(function(ele){
            return ele.textContent;
        });
        return arr;
    });

    if(givenMonth == monthsName[0].split(" ")[0]){
        await pickAdate(givenDay, givenMonth, tab);
        console.log("0 found");
        return;
    }
    else if(givenMonth == monthsName[1].split(" ")[0]){
        await pickADay(givenDay, givenMonth, tab);
        console.log("1 found");
        return;
    }
    else{
        let btnStatus = await nextMonthHandler(tab);
        if(btnStatus == true){
            console.log('hi')
            await selectDate( tab);
        }
    }
}


//this function helps us choosing month by clicking the button and navigating through months
async function nextMonthHandler(tab){
    let ans = await tab.evaluate(function(){
        let btn = document.querySelector('.DayPicker-NavButton.DayPicker-NavButton--next');
        if(btn.className == "DayPicker-NavButton DayPicker-NavButton--next"){
            btn.click();
            return true;
        }
        else{
            return false;
        }
    });
    console.log(ans);
    return ans;
}

// this function helps to pick and choose the given day on selected month
async function pickADay(day, monName, tab){
    let obj = {
        monName,
        day
    };

    await tab.evaluate(function(obj){
        let bothMonthDays = document.querySelectorAll('.DayPicker-Months .DayPicker-Day[role="gridcell"]');
        bothMonthDays = [...bothMonthDays];
        console.log(bothMonthDays);
        
        console.log(obj);
        console.log(bothMonthDays.length);
        for(let i = 0; i < bothMonthDays.length; i++){
            
            if(Number(bothMonthDays[i].textContent) == Number(obj.day)){
                let parentName = bothMonthDays[i].parentElement.parentElement.parentElement.firstChild.textContent;
                console.log(parentName);
                console.log(obj.monName);
                if(parentName.split(" ")[0] == obj.monName){
                    bothMonthDays[i].click();
                    return;
                }
            }
        }
    }, obj)
}

module.exports = searchTrains;
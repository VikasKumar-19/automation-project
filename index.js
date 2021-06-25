const pup = require('puppeteer');

let date = "23 August 2021";

(async function(){
    const browser = await pup.launch({
            headless:false,
            defaultViewport: null,
            args:['--start-maximized']
        });

    const tabs = await browser.pages();
    let tab = tabs[0];
    await tab.goto("https://www.makemytrip.com/");

    await loginHandler(tab);

    await tab.click('.menu_Trains');
    await tab.waitForSelector('[for="fromCity"]', {visible: true});

    await tab.click('[for="fromCity"]');

    await tab.type('input[autocomplete="off"]', "delhi", {delay: 100});
    let fromCity = await tab.$('#react-autowhatever-1 li');
    await fromCity.click();
    
    await tab.waitForTimeout(1000);

    await tab.type('input[autocomplete="off"]', "lucknow", {delay: 100});
    let toCity = await tab.$('#react-autowhatever-1 li');

    await toCity.click();

    await tab.waitForTimeout(1000);

    await selectDate(tab);

    // console.log('date selected')

    let classType = await tab.$('ul.travelForPopup li');
    await classType.click();
    
    await tab.click('a[data-cy="submit"]');
    console.log('clicked');

    // scrapTrainData();

})();

async function selectDate(tab){

    console.log('hello');
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
        await pickAdate(givenDay, givenMonth, tab);
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

async function pickAdate(day, monName, tab){
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


async function loginHandler(tab){
    try{
        await tab.click('.loginModal.displayBlock.modalLogin.dynHeight.personal');
        console.log("found element");
    }
    catch(err){
        console.log("not found");
        return;
    }
}
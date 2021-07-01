// let date = require('./date');

// this is a main function for selecting the date.
async function selectDate(tab, date){

    let dateArr = date.split(" ");
    let givenMonth = dateArr[1];
    let givenDay = dateArr[0];

    let monthsName = await tab.$$('.DayPicker-Months .DayPicker-Month');

    let month1 = await monthsName[0].$eval('.DayPicker-Caption div', function(monName){
        try{
            monName.querySelector('span').remove();
            return monName.textContent;
        }
        catch{
            return monName.textContent.split(" ")[0];
        }
    });
    let month2 = await monthsName[1].$eval('.DayPicker-Caption div', function(monName){
        try{
            monName.querySelector('span').remove();
            return monName.textContent;
        }
        catch{
            return monName.textContent.split(" ")[0];
        }
    });

    // console.log(month1);
    // console.log(month2);

    if(givenMonth == month1){
        await pickADay(givenDay, monthsName[0], tab);
        return;
    }
    else if(givenMonth == month2){
        await pickADay(givenDay, monthsName[1], tab);
        return;
    }

    else{
        let btnStatus = await nextMonthHandler(tab);
        if(btnStatus == true){
            // console.log('hi')
            await selectDate(tab, date);
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
    // console.log(ans);
    return ans;
}

// this function helps to pick and choose the given day on selected month
async function pickADay(day, monName, tab){
    
    await tab.evaluate(function(mon,day){
        let days = mon.querySelectorAll('.DayPicker-Day[aria-disabled="false"]');
        // console.log(days.length);
        for(let i = 0; i < days.length; i++){
            if(days[i].textContent == day){
                days[i].click();
                return;
            }
        }
    },monName,day);

}

module.exports = selectDate;
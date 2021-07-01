const pup = require('puppeteer');
const cp = require('child_process');
const fs = require('fs');
const ps = require('prompt-sync');
const prompt = ps();
const chalk = require('chalk');
const nodemailer = require('nodemailer')
//We will get searchTrains() function on requiring this file.
//This function helps to search Trains and fetch details about them.
const searchTrains = require('./train_data/searchTrains');

const searchHotels = require('./hotels_data/searchHotels');

const findTouristSpots = require('./tourist_spots/findTouristSpots');

(async function(){

    console.log(chalk.yellow.bold.italic("======!!!! HI, WELCOME TO 'MY TRIP PLANNER' !!!!======"));
    let fromPlace = prompt(chalk.green.bold.italic("ENTER YOUR CURRENT LOCATION: "));
    // console.log(from);

    let gotoPlace = prompt(chalk.green.bold.italic("ENTER WHERE YOU WANT TO TRAVEL: "));
    // console.log(gotop);

    let date = prompt(chalk.yellow.bgBlack.bold.italic("Enter the date when you want travel (format eg: 21 January 2021): "));
    // console.log(d);

    let email = prompt(chalk.yellow.bold.italic("Enter email: "));
    let emailarray = email.split(" ");
    console.log(emailarray);

    let placeNames = {
      fromPlace: fromPlace,
      toPlace: gotoPlace
    }

    let completeDate = {
      date: date
    }

    let emailData = {
      emailarray : emailarray
    }

    fs.writeFileSync('./utilities/placeNames.json', JSON.stringify(placeNames));

    fs.writeFileSync('./utilities/date.json', JSON.stringify(completeDate));

    fs.writeFileSync('./utilities/emailData.json', JSON.stringify(emailData));

    const browser = await pup.launch({
      headless:false,
      defaultViewport: null,
      args:['--start-maximized'],
      // slowMo: 100
  });

    const tabs = await browser.pages();

    let tab1 = tabs[0];

    await searchTrains(tab1);    //calling the searchTrains() function and pass the opened tab of browser.

    let tab2 = await browser.newPage();

    await searchHotels(tab2);

    let tab3 = await browser.newPage();
    await findTouristSpots(tab3);

    await cp.exec("node ./server.js");

    let tab4 = await browser.newPage();
    await tab4.goto("http://localhost:4444");

    await tab4.waitForTimeout(500);

    await autoScroll(tab4);

    const newbrowser = await pup.launch({
      
      defaultViewport: null,
      args:['--start-maximized'],
      headless: true,
    });

  const page = await newbrowser.newPage();
  await page.goto("http://localhost:4444");

  await page.pdf({
    printBackground: true,
    path: "webpage.pdf",
    format: "a2",
    margin: {
        top: "20px",
        bottom: "40px",
        left: "20px",
        right: "20px"
    }});

  await newbrowser.close();

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "awesomevikas1@gmail.com",
        pass: "Vikas@786",
    },
});


let mailOptions = {
    from: "awesomevikas1@gmail.com", // sender address
    to: emailarray, // list of receivers
    subject:'your trip manual is ready',                                                    //subject of email
    text:'We are sending your trip manual as an attachment to this mail. HappY Journey',
    attachments: [
        {
            filename: "myJourney.pdf",
            path: "webpage.pdf",
        }

    ],
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent to : ' + emailarray);
    console.log(chalk.red.bold("HAVE A SAFE JOURNEY AND ENJOY "));

});


})();

async function autoScroll(page) {
  await page.evaluate(() => {

      function scroller(){
        window.scrollBy(0,3);
        console.log("sdf");
        scrolldelay = setTimeout(scroller,10);
      }
      scroller();

  });
}
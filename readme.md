# My Trip Planner Project

I have made an automation script using Puppeteer and Nodejs. 

This project helps to fetch all the useful information which we required to plan for a trip:

The websites used for fetching information are: makemytrip.com, google.com/travel

- Train prices and availability. 🚌

- Recommended Hotels details where user want to stay. 🏨

- data is get stored in form of json files.

- Then to show data from json files on fron end I have used express to create a server which will be run after saving json files.

- To run the server from background I have used child_process module of Node Js. It will run automatically.

- I used handlebars (hbs) templating language to do server side rendering which will show the data in organized manner.

- Then pdf will be generated of that web page.

- Then I used nodemailer to attach that pdf and send to the user using mail.

### To run this project intall all the dependencies available in package.json file :

### To run the software: Use the following commands:-

`npm install`  -----> this command will help to install project dependencies.

After all the modules get installed then run the index.js file using the following command:

`node index.js`

Provide the user data which it will prompt.

That's it You are ready to go.
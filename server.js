const express = require('express');
const hbs = require('hbs');
const fs = require('fs');


let placeObj = fs.readFileSync('./utilities/placeNames.json', {encoding: 'utf-8'});
placeObj = JSON.parse(placeObj);

let trainData = fs.readFileSync('trainsData.json',{encoding: 'utf-8'})
trainData = JSON.parse(trainData);

let hotelData = fs.readFileSync('hotelData.json',{encoding: 'utf-8'})
hotelData = JSON.parse(hotelData);

let touristSpots = fs.readFileSync('touristSpots.json',{encoding: 'utf-8'})
touristSpots = JSON.parse(touristSpots);

let app = new express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(__dirname + '/public'));
app.set('view engine','hbs')

app.get('/',(req,res)=>{
    return res.render('index',{
        title: "My trip planner",
        placeObj,
        trainData,
        hotelData,
        touristSpots
    });
})

app.listen(4444, ()=>{
    console.log("Server started at http://localhost:4444");
})
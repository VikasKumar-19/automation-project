async function hotelDataScrap(tab){
    let hotels = await tab.$$('div.listingRow');

    let allHotels = [];

    for(let i = 0; i < hotels.length && i < 3; i++){
        
        await tab.waitForTimeout(500);

        let hotelData = await tab.evaluate(function(hotel){
            
            let hotelName = hotel.querySelector('[itemprop="name"]').firstElementChild.textContent;
            let hotelAddress = hotel.querySelector('[itemprop="address"]').textContent;
            let hotelPrice = hotel.querySelector('#hlistpg_hotel_shown_price').textContent;
            
            let allImg = hotel.querySelector('.imgCont img');
            
            hotel.scrollIntoView({behavior: "smooth"});

            return {
                hotelName,
                hotelAddress,
                hotelPrice,
                imgUrl: allImg.src

            }

        }, hotels[i])

        allHotels.push(hotelData);
    }

    console.log(allHotels);
}

module.exports = hotelDataScrap;
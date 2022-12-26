
//animicon = "img/arrowsmallerorange.png";
//filmicon = "img/arrowsmallerblue.png";
//youtubeicon = "img/arrowsmallerred.png";

//locaMirus = "img/MirusAcademy.png";
//locaShady = "img/ShadyOak.png";
//locaTCS = "img/TCS.png";
//locaYork = "img/Yorkshire.png";
//locaCunae = "img/Cunae.png";


const CONFIGURATION = {
    "locations": [
        { "CallOut": false, "Price": "$199", "Full": false, "title": "Katy Flagship", "Available": "Filmmaking, Animation, Youtube Creators", "address1": "5561 3rd St", "address2": "Katy, TX 77493, USA", "coords": { "lat": 29.787922492451827, "lng": -95.82045536441802 }, "placeId": "ChIJsVW26iMkQYYRq4rXBj7EgJs", "camps": [{ camp: "Filmmaking", days: "3 days", price: "$229.99"}, { camp: "Youtubers", days: "3 days", price: "$229.99"}] },
        { "CallOut": true, "Price": "NEW!", "Full": false, "title": "The Woodlands", "Available": "Filmmaking, Youtube Creators", "address1": "5655 Creekside Forest Dr,", "address2": "The Woodlands, TX 77389, USA", "coords": { "lat": 30.139868, "lng": -95.5076403 }, "placeId": "ChIJKYAxDGMxR4YRm-aGsMcIA0w", "camps": [{ camp: "Animation", days: "3 days", price: "$229.99"}, { camp: "Youtubers", days: "3 days", price: "$229.99" }] },
        //{ "Price": "$199", "Full": false, "title": "TX Christian School Cy-fair", "img": locaTCS, "Available": "Filmmaking, Animation, Youtube Creators", "address1": "17810 Kieth Harrow Blvd", "address2": "Cypress, TX 77084, USA", "coords": { "lat": 29.84985717507098, "lng": -95.67134867934465 }, "placeId": "ChIJETdJFt_ZQIYR2QC-Cb4o2bw", "camps": [{ camp: "Animation", days: "3 days | Tue-Thu", price: "$199.99", icon: animicon }, { camp: "Youtubers", days: "3 days | Tue-Thu", price: "$199.99", icon: youtubeicon }] },
        //{ "Price": "FULL!", "Full": true, "title": "Yorkshire Academy Memorial", "img": locaYork, "Available": "Filmmaking, Animation", "address1": "14120 Memorial Dr", "address2": "Houston, TX 77079, USA", "coords": { "lat": 29.77108864232313, "lng": -95.59252427790985 }, "placeId": "ChIJfWgquWTbQIYRD-wa36hRBZE", "camps": [{ camp: "Animation", days: "5 half days | Mon-Fri", price: "FULL!", icon: animicon }, { camp: "Filmmaking", days: "5 half days | Mon-Fri", price: "FULL!", icon: filmicon }] },
    ],
    "mapOptions": { "center": { "lat": 38.0, "lng": -100.0 }, "fullscreenControl": true, "mapTypeControl": false, "streetViewControl": false, "zoom": 4, "zoomControl": true, "maxZoom": 17 },
    "mapsApiKey": "AIzaSyDH_VUHgooxpBZJBWEHfHnRt_mcCRsMvyI"
};

function initMap() {
    new LocatorPlus(CONFIGURATION);
}

function exportCONFIG() {
    return CONFIGURATION;
}




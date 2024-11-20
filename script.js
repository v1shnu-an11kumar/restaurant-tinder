// DOM Elements
const card1 = document.querySelector('.restaurant__card--1');
const card2 = document.querySelector('.restaurant__card--2');

// Variables 
let restaurants = [];
let selectedRestaurant = null;

// User current location, set to BSTN Toronto 
const userLocation = { lat: 43.641920, lng: -79.397100 };



/*
Function to intialize the google places api, 
creates a fake map object to load the service 
filters the search by location, radius and type,
 appends the result to the empty restaurants array 
 */


function initMap() {
    const map = new google.maps.Map(document.createElement('div'));
    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(
        {
            location: userLocation,
            radius: 1500,
            type: 'restaurant',
        },
        (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                restaurants = results;
                displayRestaurants();
            } else {
                console.error('Error fetching restaurants:', status);
            }
        }
    );
}
/*
Function create/show cards to the user 
    evaluates if there are more than 2 restaurants returned, 
    if yes, picks two random from the list 
    ensures that they are different,
    writes each to their card
    changes them on click
 */


function displayRestaurants() {
    if (restaurants.length < 2) {
        console.log('Not enough restaurants to display.');
        return;
    }

    const randomIndex1 = Math.floor(Math.random() * restaurants.length);
    let randomIndex2 = Math.floor(Math.random() * restaurants.length);

    while (randomIndex1 === randomIndex2) {
        randomIndex2 = Math.floor(Math.random() * restaurants.length);
    }

    const restaurant1 = restaurants[randomIndex1];
    const restaurant2 = restaurants[randomIndex2];

    updateCard(card1, restaurant1);
    updateCard(card2, restaurant2);

    card1.onclick = () => selectRestaurant(restaurant1, card1, card2);
    card2.onclick = () => selectRestaurant(restaurant2, card2, card1);
};


/*
Function to update the cards
    Convert price level to dollar signs
    Creates the card html block using the distance and other data points calculated

 */


function updateCard(card, restaurant) {
    const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        restaurant.geometry.location.lat(),
        restaurant.geometry.location.lng()
    );
    const priceLevel = restaurant.price_level !== undefined
        ? '$'.repeat(restaurant.price_level)
        : 'N/A';

    card.innerHTML = `
        <h2>${restaurant.name}</h2>
        <p>${restaurant.vicinity}</p>
        <p>Distance: ${distance.toFixed(2)} km</p>
        <p>Rating: ${restaurant.rating || 'N/A'} (${restaurant.user_ratings_total || 0} reviews)</p>
        <p>Price Level: ${priceLevel}</p>
        ${
            restaurant.photos && restaurant.photos.length > 0
                ? `<img src="${restaurant.photos[0].getUrl()}" alt="${restaurant.name}" style="max-width: 100%; height: auto;">`
                : ''
        }
    `;
}


function selectRestaurant(selected, selectedCard, otherCard) {
    console.log('Selected restaurant:', selected.name);
    selectedRestaurant = selected;


    const newRestaurant = getNewRestaurant();
    if (newRestaurant) {
        updateCard(otherCard, newRestaurant);
        otherCard.onclick = () => selectRestaurant(newRestaurant, otherCard, selectedCard);
    } else {
        otherCard.innerHTML = '<p>No more restaurants available.</p>';
        otherCard.onclick = null;
    }
}


function getNewRestaurant() {
    const displayedRestaurants = [selectedRestaurant];
    const availableRestaurants = restaurants.filter(
        (r) => !displayedRestaurants.includes(r)
    );

    if (availableRestaurants.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * availableRestaurants.length);
    return availableRestaurants[randomIndex];
}


function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


function degToRad(deg) {
    return deg * (Math.PI / 180);
}


initMap();

const cards = document.querySelectorAll('article');

cards.forEach((card) => {
  card.addEventListener('click', () => {
    card.classList.add('clicked');

    setTimeout(() => {
      card.classList.remove('clicked');
    }, 500);
  });
});
// DOM Elements
const card1 = document.querySelector('.restaurant__card--1');
const card2 = document.querySelector('.restaurant__card--2');

let restaurants = [];
let selectedRestaurant = null;

// Your current location (replace with actual coordinates if available)
const userLocation = { lat: 43.641920, lng: -79.397100 }; // Example: New York City

// Initialize the Google Places API
function initMap() {
    // Create a dummy map element (not displayed)
    const map = new google.maps.Map(document.createElement('div'));

    // Use the Places Service
    const service = new google.maps.places.PlacesService(map);

    // Fetch nearby restaurants
    service.nearbySearch(
        {
            location: userLocation,
            radius: 1500, // Search radius in meters
            type: 'restaurant', // Search for restaurants
        },
        (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                restaurants = results; // Store results
                displayRestaurants(); // Display two initial restaurants
            } else {
                console.error('Error fetching restaurants:', status);
            }
        }
    );
}

// Display two random restaurants in the cards
function displayRestaurants() {
    if (restaurants.length < 2) {
        console.log('Not enough restaurants to display.');
        return;
    }

    // Select two random restaurants
    const randomIndex1 = Math.floor(Math.random() * restaurants.length);
    let randomIndex2 = Math.floor(Math.random() * restaurants.length);

    // Ensure the indexes are different
    while (randomIndex1 === randomIndex2) {
        randomIndex2 = Math.floor(Math.random() * restaurants.length);
    }

    const restaurant1 = restaurants[randomIndex1];
    const restaurant2 = restaurants[randomIndex2];

    // Update the cards with restaurant details
    updateCard(card1, restaurant1);
    updateCard(card2, restaurant2);

    // Add event listeners for selection
    card1.onclick = () => selectRestaurant(restaurant1, card1, card2);
    card2.onclick = () => selectRestaurant(restaurant2, card2, card1);
}

// Update a card with restaurant details
function updateCard(card, restaurant) {
    const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        restaurant.geometry.location.lat(),
        restaurant.geometry.location.lng()
    );

    // Convert price level to dollar signs
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

// Handle restaurant selection
function selectRestaurant(selected, selectedCard, otherCard) {
    console.log('Selected restaurant:', selected.name);
    selectedRestaurant = selected; // Store the selected restaurant

    // Replace the unselected card with a new random restaurant
    const newRestaurant = getNewRestaurant();
    if (newRestaurant) {
        updateCard(otherCard, newRestaurant);
        otherCard.onclick = () => selectRestaurant(newRestaurant, otherCard, selectedCard);
    } else {
        otherCard.innerHTML = '<p>No more restaurants available.</p>';
        otherCard.onclick = null; // Remove the click event
    }
}

// Get a new random restaurant that hasn't been displayed yet
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

// Calculate the distance between two coordinates using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

// Convert degrees to radians
function degToRad(deg) {
    return deg * (Math.PI / 180);
}

// Initialize the application
initMap();

const cards = document.querySelectorAll('article');

cards.forEach((card) => {
  card.addEventListener('click', () => {
    card.classList.add('clicked');

    // Remove the 'clicked' class after the animation ends
    setTimeout(() => {
      card.classList.remove('clicked');
    }, 500); // Match the animation duration (0.5s)
  });
});
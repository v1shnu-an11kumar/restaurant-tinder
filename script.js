// DOM Elements
const card1Content = document.querySelector('.restaurant__card--1 .card-content');
const card2Content = document.querySelector('.restaurant__card--2 .card-content');
const priceSlider = document.querySelector('#price-slider');
const priceLabel = document.querySelector('#price-label');
const card1 = document.querySelector('.restaurant__card--1');
const card2 = document.querySelector('.restaurant__card--2');

let restaurants = [];
let displayedRestaurants = [];
let filteredRestaurants = [];
let selectedRestaurant = null;

// Your current location
const userLocation = { lat: 43.641920, lng: -79.397100 };

// Initialize the Google Places API
function initMap() {
    const map = new google.maps.Map(document.createElement('div'));
    const service = new google.maps.places.PlacesService(map);

    service.nearbySearch(
        {
            location: userLocation,
            radius: 10000,
            type: 'restaurant',
        },
        async (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                restaurants = await fetchRestaurantDetails(service, results);
                restaurants.sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0));
                filteredRestaurants = [...restaurants];
                displayRestaurants();
            } else {
                console.error('Error fetching restaurants:', status);
            }
        }
    );
}

// Fetch additional details for each restaurant
async function fetchRestaurantDetails(service, results) {
    return Promise.all(
        results.map(
            (restaurant) =>
                new Promise((resolve) => {
                    service.getDetails({ placeId: restaurant.place_id }, (details, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            resolve({ ...restaurant, ...details });
                        } else {
                            resolve(restaurant);
                        }
                    });
                })
        )
    );
}

// Display two restaurants
function displayRestaurants() {
    if (filteredRestaurants.length < 2) return;

    const restaurant1 = getNextRestaurant();
    const restaurant2 = getNextRestaurant();

    if (!restaurant1 || !restaurant2) return;

    updateCard(card1Content, restaurant1, card1);
    updateCard(card2Content, restaurant2, card2);

    // Add click handlers for card selection
    addCardClickHandler(card1, restaurant1, card2);
    addCardClickHandler(card2, restaurant2, card1);
}

// Get the next restaurant (avoid repeats)
function getNextRestaurant() {
    for (let restaurant of filteredRestaurants) {
        if (!displayedRestaurants.includes(restaurant.place_id)) {
            displayedRestaurants.push(restaurant.place_id);
            return restaurant;
        }
    }
    return null; // No more unique restaurants
}

// Update a card with restaurant details, hours, and user images
function updateCard(cardContent, restaurant, card) {
    const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        restaurant.geometry.location.lat(),
        restaurant.geometry.location.lng()
    );

    const priceLevel = restaurant.price_level ? '$'.repeat(restaurant.price_level) : 'N/A';
    const websiteUrl = restaurant.website || '#';

    // Shorten hours and format on a single line
    const openingHours = restaurant.opening_hours?.weekday_text
        ?.map((hour) =>
            hour
                .replace(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/g, (day) =>
                    day.charAt(0)
                )
                .replace(/,/g, '') // Remove any commas
        )
        .join(' | ') || 'Hours not available';

    const userPhotos = restaurant.photos?.slice(0, 4) || [];

    cardContent.innerHTML = `
        <h2>${restaurant.name}</h2>
        <p>${restaurant.vicinity}</p>
        <p>Distance: ${distance.toFixed(2)} km</p>
        <p>Rating: ${restaurant.rating || 'N/A'} (${restaurant.user_ratings_total || 0} reviews)</p>
        <p>Price Level: ${priceLevel}</p>
        <div class="hours-and-website">
          <p class="hours">${openingHours}</p>
          <button class="website-link" onclick="window.open('${websiteUrl}', '_blank')">Visit Website</button>
        </div>
        ${
            userPhotos.length > 0
                ? `<div class="user-images">
                    ${userPhotos
                        .map(
                            (photo) => `<img src="${photo.getUrl()}" alt="${restaurant.name} user image" />`
                        )
                        .join('')}
                </div>`
                : ''
        }
    `;

    card.classList.remove('clicked'); // Ensure previous selection is cleared
}

// Add click event listener to restaurant cards
function addCardClickHandler(card, restaurant, otherCard) {
    card.onclick = () => {
        console.log('Selected restaurant:', restaurant.name);

        selectedRestaurant = restaurant;

        // Remove the `.clicked` class from all cards
        document.querySelectorAll('.restaurant__card--1, .restaurant__card--2').forEach((c) =>
            c.classList.remove('clicked')
        );

        // Add the `.clicked` class to the selected card
        card.classList.add('clicked');

        // Replace the unselected card with a new restaurant
        const newRestaurant = getNextRestaurant();
        if (newRestaurant) {
            const otherCardContent = otherCard.querySelector('.card-content');
            updateCard(otherCardContent, newRestaurant, otherCard);
            addCardClickHandler(otherCard, newRestaurant, card); // Update click handler
        } else {
            otherCard.querySelector('.card-content').innerHTML = '<p>No more restaurants available.</p>';
            otherCard.onclick = null; // Remove click event
        }
    };
}

// Filter restaurants based on price range slider
priceSlider.addEventListener('input', () => {
    const selectedPrice = parseInt(priceSlider.value);
    priceLabel.textContent = selectedPrice === 4 ? 'All' : `$${'$'.repeat(selectedPrice)}`;

    filteredRestaurants = restaurants.filter(
        (restaurant) => !restaurant.price_level || restaurant.price_level <= selectedPrice
    );

    displayedRestaurants = [];
    displayRestaurants();
});

// Calculate the distance between two coordinates
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

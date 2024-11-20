// // DOM Elements
// const card1Content = document.querySelector('.restaurant__card--1 .card-content');
// const card2Content = document.querySelector('.restaurant__card--2 .card-content');
// const button1 = document.querySelector('.restaurant-link--1');
// const button2 = document.querySelector('.restaurant-link--2');
// const card1 = document.querySelector('.restaurant__card--1');
// const card2 = document.querySelector('.restaurant__card--2');

// let restaurants = [];
// let displayedRestaurants = [];
// let selectedRestaurant = null;

// // Your current location
// const userLocation = { lat: 43.641920, lng: -79.397100 };

// // Initialize the Google Places API
// function initMap() {
//     const map = new google.maps.Map(document.createElement('div'));
//     const service = new google.maps.places.PlacesService(map);

//     service.nearbySearch(
//         {
//             location: userLocation,
//             radius: 20000,
//             type: 'restaurant',
//         },
//         async (results, status) => {
//             if (status === google.maps.places.PlacesServiceStatus.OK) {
//                 restaurants = await fetchRestaurantDetails(service, results);
//                 restaurants.sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0));
//                 displayRestaurants();
//             } else {
//                 console.error('Error fetching restaurants:', status);
//             }
//         }
//     );
// }

// // Fetch additional details for each restaurant
// async function fetchRestaurantDetails(service, results) {
//     return Promise.all(
//         results.map(
//             (restaurant) =>
//                 new Promise((resolve) => {
//                     service.getDetails({ placeId: restaurant.place_id }, (details, status) => {
//                         if (status === google.maps.places.PlacesServiceStatus.OK) {
//                             resolve({ ...restaurant, ...details });
//                         } else {
//                             resolve(restaurant);
//                         }
//                     });
//                 })
//         )
//     );
// }

// // Display two restaurants
// function displayRestaurants() {
//     if (restaurants.length < 2) return;

//     const restaurant1 = getNextRestaurant();
//     const restaurant2 = getNextRestaurant();

//     if (!restaurant1 || !restaurant2) return;

//     updateCard(card1Content, button1, restaurant1);
//     updateCard(card2Content, button2, restaurant2);

//     // Set click handlers for card selection
//     card1.onclick = () => selectRestaurant(restaurant1, card1, card2);
//     card2.onclick = () => selectRestaurant(restaurant2, card2, card1);
// }

// // Get the next restaurant (avoid repeats)
// function getNextRestaurant() {
//     for (let restaurant of restaurants) {
//         if (!displayedRestaurants.includes(restaurant.place_id)) {
//             displayedRestaurants.push(restaurant.place_id);
//             return restaurant;
//         }
//     }
//     return null; // No more unique restaurants
// }

// // Update a card with restaurant details, hours, and user images
// function updateCard(cardContent, button, restaurant) {
//     const distance = calculateDistance(
//         userLocation.lat,
//         userLocation.lng,
//         restaurant.geometry.location.lat(),
//         restaurant.geometry.location.lng()
//     );

//     const priceLevel = restaurant.price_level ? '$'.repeat(restaurant.price_level) : 'N/A';
//     const websiteUrl = restaurant.website || '#';
//     const openingHours = restaurant.opening_hours?.weekday_text || []; // Hours of operation

//     // Limit to 4 user photos
//     const userPhotos = restaurant.photos?.slice(0, 4) || [];

//     // Update card content
//     cardContent.innerHTML = `
//         <h2>${restaurant.name}</h2>
//         <p>${restaurant.vicinity}</p>
//         <p>Distance: ${distance.toFixed(2)} km</p>
//         <p>Rating: ${restaurant.rating || 'N/A'} (${restaurant.user_ratings_total || 0} reviews)</p>
//         <p>Price Level: ${priceLevel}</p>
//         ${
//             openingHours.length > 0
//                 ? `<p>Hours:</p><ul class="opening-hours">
//                     ${openingHours.map((hour) => `<li>${hour}</li>`).join('')}
//                 </ul>`
//                 : '<p>Hours: Not available</p>'
//         }
//         ${
//             restaurant.photos?.length
//                 ? `<div class="user-images">
//                     ${userPhotos
//                         .map(
//                             (photo) => `<img src="${photo.getUrl()}" alt="${restaurant.name} user image" />`
//                         )
//                         .join('')}
//                 </div>`
//                 : ''
//         }
//     `;

//     // Update and show the button
//     button.hidden = false;
//     button.textContent = 'Visit Website';
//     button.onclick = (event) => {
//         event.stopPropagation(); // Prevent card click handler from firing
//         window.open(websiteUrl, '_blank');
//     };
// }

// // Handle restaurant selection
// function selectRestaurant(selected, selectedCard, otherCard) {
//     console.log('Selected restaurant:', selected.name);

//     selectedRestaurant = selected; // Store the selected restaurant

//     // Remove the `.clicked` class from all cards
//     document.querySelectorAll('.restaurant__card--1, .restaurant__card--2').forEach((card) => {
//         card.classList.remove('clicked');
//     });

//     // Add the `.clicked` class to the selected card
//     selectedCard.classList.add('clicked');

//     // Replace the unselected card with a new restaurant
//     const newRestaurant = getNextRestaurant();
//     if (newRestaurant) {
//         const otherCardContent = otherCard.querySelector('.card-content');
//         const otherButton = otherCard.querySelector('button');
//         updateCard(otherCardContent, otherButton, newRestaurant);

//         // Update click handler for the replaced card
//         otherCard.onclick = () => selectRestaurant(newRestaurant, otherCard, selectedCard);
//     } else {
//         otherCard.querySelector('.card-content').innerHTML = '<p>No more restaurants available.</p>';
//         otherCard.querySelector('button').hidden = true;
//         otherCard.onclick = null; // Remove the click event
//     }
// }

// // Calculate the distance between two coordinates
// function calculateDistance(lat1, lon1, lat2, lon2) {
//     const R = 6371; // Radius of the Earth in kilometers
//     const dLat = degToRad(lat2 - lat1);
//     const dLon = degToRad(lon2 - lon1);

//     const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
//         Math.sin(dLon / 2) * Math.sin(dLon / 2);

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
// }

// // Convert degrees to radians
// function degToRad(deg) {
//     return deg * (Math.PI / 180);
// }

// // Initialize the app
// initMap();

// DOM Elements
const card1Content = document.querySelector('.restaurant__card--1 .card-content');
const card2Content = document.querySelector('.restaurant__card--2 .card-content');
const button1 = document.querySelector('.restaurant-link--1');
const button2 = document.querySelector('.restaurant-link--2');
const card1 = document.querySelector('.restaurant__card--1');
const card2 = document.querySelector('.restaurant__card--2');
const priceFilter = document.querySelector('#price-range');

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

    updateCard(card1Content, button1, restaurant1);
    updateCard(card2Content, button2, restaurant2);

    // Set click handlers for card selection
    card1.onclick = () => selectRestaurant(restaurant1, card1, card2);
    card2.onclick = () => selectRestaurant(restaurant2, card2, card1);
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
function updateCard(cardContent, button, restaurant) {
    const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        restaurant.geometry.location.lat(),
        restaurant.geometry.location.lng()
    );

    const priceLevel = restaurant.price_level ? '$'.repeat(restaurant.price_level) : 'N/A';
    const websiteUrl = restaurant.website || '#';

    // Convert hours to a shorter format (e.g., M 11 AM - 1 PM)
    const openingHours = restaurant.opening_hours?.weekday_text?.map((hour) =>
        hour.replace(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/g, (day) =>
            day.charAt(0)
        )
    ) || [];

    const userPhotos = restaurant.photos?.slice(0, 4) || [];

    cardContent.innerHTML = `
        <h2>${restaurant.name}</h2>
        <p>${restaurant.vicinity}</p>
        <p>Distance: ${distance.toFixed(2)} km</p>
        <p>Rating: ${restaurant.rating || 'N/A'} (${restaurant.user_ratings_total || 0} reviews)</p>
        <p>Price Level: ${priceLevel}</p>
        ${
            openingHours.length > 0
                ? `<p>Hours:</p><ul class="opening-hours">
                    ${openingHours.map((hour) => `<li>${hour}</li>`).join('')}
                </ul>`
                : '<p>Hours: Not available</p>'
        }
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

    button.hidden = false;
    button.textContent = 'Visit Website';
    button.onclick = (event) => {
        event.stopPropagation();
        window.open(websiteUrl, '_blank');
    };
}

// Handle restaurant selection
function selectRestaurant(selected, selectedCard, otherCard) {
    console.log('Selected restaurant:', selected.name);

    selectedRestaurant = selected;

    document.querySelectorAll('.restaurant__card--1, .restaurant__card--2').forEach((card) => {
        card.classList.remove('clicked');
    });

    selectedCard.classList.add('clicked');

    const newRestaurant = getNextRestaurant();
    if (newRestaurant) {
        const otherCardContent = otherCard.querySelector('.card-content');
        const otherButton = otherCard.querySelector('button');
        updateCard(otherCardContent, otherButton, newRestaurant);

        otherCard.onclick = () => selectRestaurant(newRestaurant, otherCard, selectedCard);
    } else {
        otherCard.querySelector('.card-content').innerHTML = '<p>No more restaurants available.</p>';
        otherCard.querySelector('button').hidden = true;
        otherCard.onclick = null;
    }
}

// Filter restaurants based on selected price range
priceFilter.addEventListener('change', () => {
    const selectedPrice = priceFilter.value;

    if (selectedPrice === 'all') {
        filteredRestaurants = [...restaurants];
    } else {
        filteredRestaurants = restaurants.filter(
            (restaurant) => restaurant.price_level === parseInt(selectedPrice)
        );
    }

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

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

const userLocation = { lat: 43.641920, lng: -79.397100 };

function initMap() {
    const map = new google.maps.Map(document.createElement('div'));
    const service = new google.maps.places.PlacesService(map);

    service.nearbySearch(
        {
            location: userLocation,
            radius: 20000,
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

function displayRestaurants() {
    if (filteredRestaurants.length < 2) return;

    const restaurant1 = getNextRestaurant();
    const restaurant2 = getNextRestaurant();

    if (!restaurant1 || !restaurant2) return;

    updateCard(card1Content, restaurant1, card1);
    updateCard(card2Content, restaurant2, card2);

    addCardClickHandler(card1, restaurant1, card2);
    addCardClickHandler(card2, restaurant2, card1);
}

function getNextRestaurant() {
    for (let restaurant of filteredRestaurants) {
        if (!displayedRestaurants.includes(restaurant.place_id)) {
            displayedRestaurants.push(restaurant.place_id);
            return restaurant;
        }
    }
    return null;
}

function updateCard(cardContent, restaurant, card) {
    const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        restaurant.geometry.location.lat(),
        restaurant.geometry.location.lng()
    );

    const priceLevel = restaurant.price_level ? '$'.repeat(restaurant.price_level) : '🤷‍♀️';
    const websiteUrl = restaurant.website || '#';

    const openingHours = restaurant.opening_hours?.weekday_text
        ?.map((hour) =>
            hour
                .replace(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/g, (day) =>
                    day.charAt(0)
                )
                .replace(/,/g, '')
        )
        .join(' | ') || '🤷‍♀️';

    const userPhotos = restaurant.photos?.slice(0, 4) || [];

    card.innerHTML = `
        <h2>${restaurant.name}</h2> <!-- Title outside card-content -->
        <div class="rating">
            <span class="rating-value">${restaurant.rating || '🤷‍♀️'}</span>
            <span class="rating-reviews">(${restaurant.user_ratings_total || 0} reviews)</span>
        </div>
        <div class="card-content">
            <!-- Flex container for the main information -->
            <div class="info-container">
                <p>${restaurant.vicinity}</p>
                <p>${distance.toFixed(2)} km away</p>
                <p>${priceLevel}</p>
            </div>
        </div>
        <!-- Hours and website outside of card-content -->
        <div class="hours-and-website">
            <p class="hours">${openingHours}</p>
            <button class="website-link" onclick="window.open('${websiteUrl}', '_blank')">Visit Website</button>
        </div>
        <!-- Images outside of card-content -->
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

    card.classList.remove('clicked');
}

function addCardClickHandler(card, restaurant, otherCard) {
    card.onclick = () => {
        console.log('Selected restaurant:', restaurant.name);

        selectedRestaurant = restaurant;

        document.querySelectorAll('.restaurant__card--1, .restaurant__card--2').forEach((c) =>
            c.classList.remove('clicked')
        );

        card.classList.add('clicked');

        const newRestaurant = getNextRestaurant();
        if (newRestaurant) {
            const otherCardContent = otherCard.querySelector('.card-content');
            updateCard(otherCardContent, newRestaurant, otherCard);
            addCardClickHandler(otherCard, newRestaurant, card);
        } else {
            otherCard.querySelector('.card-content').innerHTML = '<p>No more restaurants available.</p>';
            otherCard.onclick = null;
        }
    };
}

priceSlider.addEventListener('input', () => {
    const selectedPrice = parseInt(priceSlider.value);
    priceLabel.textContent = selectedPrice === 4 ? 'All' : `${'$'.repeat(selectedPrice)}`;

    filteredRestaurants = restaurants.filter(
        (restaurant) => !restaurant.price_level || restaurant.price_level <= selectedPrice
    );

    displayedRestaurants = [];
    displayRestaurants();
});

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

const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

function createStar() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3,
        color: `hsl(${Math.random() * 360}, 100%, 80%)`,
        speed: Math.random() * 1 + 0.5,
    };
}

for (let i = 0; i < 100; i++) {
    stars.push(createStar());
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();

        star.y += star.speed;

        if (star.y > canvas.height) {
            star.y = -star.radius;
            star.x = Math.random() * canvas.width;
        }
    });

    requestAnimationFrame(animateStars);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push(createStar());
    }
});

animateStars();

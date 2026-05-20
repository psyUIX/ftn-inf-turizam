class Restaurant {
    constructor(naziv, opis, kuhinje) {
        this.naziv = naziv;
        this.opis = opis;
        this.kuhinje = kuhinje;
    }
}

const initialRestaurants = [
    new Restaurant("Italijanski kutak", "Autentični ukusi Italije u centru grada.", ["Italijanska"]),
    new Restaurant("Azijski raj", "Najbolje iz azijske kuhinje na jednom mestu.", ["Azijska", "Indonezanska"]),
    new Restaurant("Gurmanova oaza", "Tradicionalna srpska i balkanska kuhinja.", ["Srpska", "Balkanska"])
];

function loadRestaurants() {
    const saved = localStorage.getItem('restaurants');
    if (saved) {
        const raw = JSON.parse(saved);
        return raw.map(r => new Restaurant(r.naziv, r.opis, r.kuhinje));
    }
    localStorage.setItem('restaurants', JSON.stringify(initialRestaurants));
    return initialRestaurants;
}

function saveRestaurants(restaurants) {
    localStorage.setItem('restaurants', JSON.stringify(restaurants));
}

let restaurants = loadRestaurants();

function showRestaurantDetails(restaurant) {
    const detailsDiv = document.querySelector('#restaurant-details');
    detailsDiv.style.display = 'block';
    detailsDiv.innerHTML = '';

    const p = document.createElement('p');
    p.innerHTML = `
        <strong>${restaurant.naziv}</strong><br>
        <em>Tip kuhinje:</em> ${restaurant.kuhinje.join(', ')}<br>
        <em>Opis:</em> ${restaurant.opis}
    `;
    detailsDiv.appendChild(p);
}

function createRestaurantRow(restaurant, index) {
    const tbody = document.querySelector('#restaurants tbody');
    const tr = document.createElement('tr');

    const tdIndex = document.createElement('td');
    tdIndex.textContent = index + 1;

    const tdNaziv = document.createElement('td');
    tdNaziv.textContent = restaurant.naziv;

    const tdKuhinja = document.createElement('td');
    tdKuhinja.textContent = restaurant.kuhinje.join(', ');

    tr.appendChild(tdIndex);
    tr.appendChild(tdNaziv);
    tr.appendChild(tdKuhinja);

    tr.addEventListener('click', function () {
        document.querySelectorAll('#restaurants tbody tr').forEach(r => r.classList.remove('selected'));
        tr.classList.add('selected');
        showRestaurantDetails(restaurant);
    });

    tbody.appendChild(tr);
}

function renderRestaurants() {
    const tbody = document.querySelector('#restaurants tbody');
    tbody.innerHTML = '';
    restaurants.forEach((restaurant, i) => createRestaurantRow(restaurant, i));
}

function addCuisineField() {
    const container = document.querySelector('#cuisineContainer');
    const div = document.createElement('div');
    div.classList.add('cuisine-input');

    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'cuisines';
    input.placeholder = 'Unesite kuhinju';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '-';
    removeBtn.onclick = function () {
        container.removeChild(div);
    };

    div.appendChild(input);
    div.appendChild(removeBtn);
    container.appendChild(div);
}

function handleFormSubmission() {
    const submitBtn = document.querySelector('#submitBtn');
    submitBtn.addEventListener('click', function () {
        const form = document.querySelector('#form');
        const formData = new FormData(form);

        const naziv = formData.get('naziv');
        const opis = formData.get('opis');
        const kuhinje = formData.getAll('cuisines').filter(k => k.trim() !== '');

        if (!naziv || !opis) {
            alert('Molimo popunite sva obavezna polja.');
            return;
        }

        const newRestaurant = new Restaurant(naziv, opis, kuhinje);
        restaurants.push(newRestaurant);
        saveRestaurants(restaurants);
        createRestaurantRow(newRestaurant, restaurants.length - 1);

        form.reset();
        document.querySelector('#cuisineContainer').innerHTML = `
            <div class="cuisine-input">
                <input type="text" name="cuisines" placeholder="Unesite kuhinju">
                <button type="button" onclick="addCuisineField()">+</button>
            </div>
        `;
    });
}

renderRestaurants();
handleFormSubmission();
class Tour {
    constructor(naziv, opis, duzina, tagovi) {
        this.naziv = naziv;
        this.opis = opis;
        this.duzina = duzina;
        this.tagovi = tagovi;
    }
}

const initialTours = [
    new Tour("Tvrđava Petrovaradin", "Istorijska tura kroz jednu od najlepših tvrđava u Evropi.", 5, ["istorijska", "gradska"]),
    new Tour("Fruška Gora", "Planinska tura kroz nacionalni park Fruška Gora.", 20, ["priroda", "planinska"]),
    new Tour("Novi Sad šetnja", "Razgledanje centra Novog Sada i Dunavskog parka.", 8, ["gradska", "kulturna"])
];

function loadTours() {
    const saved = localStorage.getItem('tours');
    if (saved) {
        const raw = JSON.parse(saved);
        return raw.map(t => new Tour(t.naziv, t.opis, t.duzina, t.tagovi));
    }
    localStorage.setItem('tours', JSON.stringify(initialTours));
    return initialTours;
}

function saveTours(tours) {
    localStorage.setItem('tours', JSON.stringify(tours));
}

let tours = loadTours();

function showTourDetails(tour) {
    const detailsDiv = document.querySelector('#tour-details');
    detailsDiv.style.display = 'block';
    detailsDiv.innerHTML = '';

    const p = document.createElement('p');
    p.innerHTML = `
        <strong>${tour.naziv}</strong><br>
        <em>Opis:</em> ${tour.opis}<br>
        <em>Dužina:</em> ${tour.duzina} km<br>
        <em>Tagovi:</em> ${tour.tagovi.join(', ')}
    `;
    detailsDiv.appendChild(p);
}

function createTourRow(tour, index) {
    const tbody = document.querySelector('#tours tbody');
    const tr = document.createElement('tr');

    const tdIndex = document.createElement('td');
    tdIndex.textContent = index + 1;

    const tdNaziv = document.createElement('td');
    tdNaziv.textContent = tour.naziv;

    const tdDuzina = document.createElement('td');
    tdDuzina.textContent = tour.duzina;

    tr.appendChild(tdIndex);
    tr.appendChild(tdNaziv);
    tr.appendChild(tdDuzina);

    tr.addEventListener('click', function () {
        document.querySelectorAll('#tours tbody tr').forEach(r => r.classList.remove('selected'));
        tr.classList.add('selected');
        showTourDetails(tour);
    });

    tbody.appendChild(tr);
}

function renderTours() {
    const tbody = document.querySelector('#tours tbody');
    tbody.innerHTML = '';
    tours.forEach((tour, i) => createTourRow(tour, i));
}

function addTagField() {
    const container = document.querySelector('#tagContainer');
    const div = document.createElement('div');
    div.classList.add('tag-input');

    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'tags';
    input.placeholder = 'Unesite tag';

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
        const duzina = parseInt(formData.get('duzina'));
        const tagovi = formData.getAll('tags').filter(t => t.trim() !== '');

        if (!naziv || !opis || isNaN(duzina)) {
            alert('Molimo popunite sva obavezna polja.');
            return;
        }

        const newTour = new Tour(naziv, opis, duzina, tagovi);
        tours.push(newTour);
        saveTours(tours);
        createTourRow(newTour, tours.length - 1);

        form.reset();
        document.querySelector('#tagContainer').innerHTML = `
            <div class="tag-input">
                <input type="text" name="tags" placeholder="Unesite tag">
                <button type="button" onclick="addTagField()">+</button>
            </div>
        `;
    });
}

renderTours();
handleFormSubmission();
'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];




class Workout {
    date = new Date();
    // id = (new Date + '').slice(-10)
    id = (Date.now() + '').slice(-10)
    constructor(coords, distance, duration) {
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;


    }
}

class Running extends Workout {
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calPace();
    }
    calPace() {
        /* !!!:   min/km */
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}

class Cycling extends Workout {
    constructor(coords, distance, duration, elavationGain) {
        super(coords, distance, duration);
        this.elavationGain = elavationGain;
        this.calSpeed();
    }
    calSpeed() {
        /* !!!:   km/hr */
        this.Speed = this.distance / (this.distance / 60);
        return this.pace;
    }
}

// EXPERIMENT
const run1 = new Running([39, -12], 5.2, 24, 178);
const cycling1 = new Cycling([39, -12], 27, 95, 523);
console.log(run1, cycling1);



/// APPLICATION ARCHITECTURE

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


let map, mapEvent;
class App {
  #map;
  #mapEvent;

    constructor() {
        this._getPostion();

        form.addEventListener('submit', this._newWorkout.bind(this));

        form.addEventListener('change', this._toggleElevetionfield);
    }

    _getPostion() {
        // Find location\
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(
                this._loadMap.bind(this),
                function() {
                    alert('Could not get your location! Turn on your location');
                }
            );
    }

    _loadMap(position) {
        const { latitude } = position.coords;
        const { longitude } = position.coords;

        // console.log(latitude, longitude);
        // console.log(
        //     `https://www.google.com/maps/place/Flogstav%C3%A4gen,+Uppsala/@{atitude}.{longitude}`
        // );
        const coords = [latitude, longitude];

        this.#map = L.map('map').setView(coords, 10);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.#map);

        /* NOTE: handlist hidden */
        this.#map.on('click', this._showForm.bind(this));
    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _toggleElevetionfield() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(e) {
        e.preventDefault();
        const validInput = (...inputs) => inputs.every(inp => Number.isFinite(inp));
        const allPostive = (...inputs) => inputs.every(inp => inp > 0)

        // Get data from
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;


        //  If working  running, create running object
        if (type === 'running') {
            const cadence = +inputCadence.value;

            // Check if data is vaild
            if (
                // !Number.isFinite(distance) ||
                // !Number.isFinite(duration) ||
                // !Number.isFinite(cadence)

                !validInput(distance, duration, cadence) || !allPostive(distance, duration, cadence)
            ) return alert('Inputs have to be positive number!')
        }

        //  If  workout cycling,  create cycling oject
        if (type === 'cycling') {
            const elevation = +inputElevation.value;

            // Check if data is vaild
            if (!validInput(distance, duration, elevation) ||
                !allPostive(distance, duration)
            ) return alert('Inputs have to be positive number!')
        }
        // Add new object  to workout  array
        // Render  workout  on map as marker

        const { lat, lng } = this.#mapEvent.latlng;
        L.marker([lat, lng])
            .addTo(this.#map)
            .bindPopup(
                L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className: 'running-popup',
                })
            )
            .setPopupContent('Workout')
            .openPopup();
        //  Render workout  on list
        // Hide form + Clear input fields

        //NOTE:  jshint ignore:
        inputType.value =
            inputDuration.value =
            inputElevation.value =
            inputElevation.value =
            '';
        // console.log(mapEvent);


    }
}

const app = new App();

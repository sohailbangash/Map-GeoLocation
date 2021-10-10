'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map, mapEvent;

class App {#
    map;#
    mapEvent;

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

        // NOTE:  jshint ignore:  Clear input fields
        inputType.value =
            inputDuration.value =
            inputElevation.value =
            inputElevation.value =
            '';

        // console.log(mapEvent);
        /* NOTE: display marker */
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
    }
}

const app = new App();
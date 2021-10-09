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

// Find location\
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
            const { latitude } = position.coords;
            const { longitude } = position.coords;

            // console.log(latitude, longitude);
            // console.log(
            //     `https://www.google.com/maps/place/Flogstav%C3%A4gen,+Uppsala/@{atitude}.{longitude}`
            // );
            const coords = [latitude, longitude];


            map = L.map('map').setView(coords, 10);

            L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);


            /* NOTE: handlist hidden */
            map.on('click', function(mapE) {
                mapEvent = mapE;
                form.classList.remove('hidden');
                inputDistance.focus();



            });
        },
        function() {
            alert('Could not get your location! Turn on your location');
        }
    );
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // NOTE:  jshint ignore:  Clear input fields
        inputType.value = inputDuration.value = inputElevation.value = inputElevation.value = '';

        // console.log(mapEvent);
        /* NOTE: display marker */
        const { lat, lng } = mapEvent.latlng;
        L.marker([lat, lng])
            .addTo(map)
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
    });

    form.addEventListener('change', function() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    });

}
var tableResults = document.querySelector("#data-results");
var lineTemplate = document.createElement("tbody");
var FeatureCollection;

var mymap = L.map('map').setView([46.45, 1.49], 6);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZHB0aDQ0IiwiYSI6ImNrcDgwdHFybzA1bXAydnBudTZ0ZDMwbW4ifQ.RknTu3v7M4r4WmH6eXk0jg'
}).addTo(mymap);


window.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    launchTemplateCreation()
})
let tableResults = document.querySelector("#data-results");
let marker,FeatureCollection;
let lineTemplate = document.createElement("tbody");

let mymap = L.map('map').setView([46.45, 1.49], 6);
/**
 * Création de la carte et ajout dans le document
 */
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZHB0aDQ0IiwiYSI6ImNrcDgwdHFybzA1bXAydnBudTZ0ZDMwbW4ifQ.RknTu3v7M4r4WmH6eXk0jg'
}).addTo(mymap);

/**
 * Affiche sur la carte les adresses renvoyées par l'API du gouvernement 
 *  1 - Nettoyage du tableau
 *  2 - Création de la nouvelle ligne basée sur le template récupéré plus tôt
 *  3 - Ajout de la nouvelle ligne au tableau
 * @param {Object} response 
 */
function displayLocationReturnInTable(response) {
    FeatureCollection = JSON.parse(response);
    $("#data-results tr>td").remove();
    FeatureCollection.features.forEach((element, index) => {
        let propertiesToDisplay = ["housenumber","street","city","postcode","oldcity"];
        let propertiesHTML = '<div>'; 
        propertiesToDisplay.forEach(item => {
            if(element.properties[item]){
                propertiesHTML+='<div><b>'+item.toUpperCase()+'</b> : '+element.properties[item]+'</div>'
            }     
        });
        propertiesHTML+='</div>';
        let newTableLine = lineTemplate.childNodes[0].cloneNode(true);
        
        newTableLine.querySelector(".locate").innerHTML = '<button class="glyph-marker" id= "locate-'+ index +'"></button>';
        newTableLine.querySelector(".locate").childNodes[0].addEventListener("click", function(evt){
            let coord = FeatureCollection.features[parseInt(evt.target.id.match(/\d+/)[0])].geometry.coordinates;
            if(marker){
                mymap.removeLayer(marker)
            }
            marker = L.marker([coord[1],coord[0]],{}).addTo(mymap);
            marker.bindPopup(propertiesHTML);
            mymap.setView([coord[1],coord[0]],10);
            document.querySelector("#data-information").innerHTML = '<div class="information-header">Informations sur le point sélectionné</div>'+ propertiesHTML;
        });
        newTableLine.querySelector(".location").innerHTML = element.properties.label;
        newTableLine.querySelector(".coordinates").innerHTML = '<b>Lat</b> : ' + element.geometry.coordinates[0] + ' <br> <b>Lon</b> : ' + element.geometry.coordinates[1];
        newTableLine.querySelector(".score").innerHTML = (element.properties.score*10).toFixed(4)+'/10';
        tableResults.appendChild(newTableLine);
        
    });
}
/**
 * Lance la localisation de l'adresse saisie par l'utilisateur
 * @param {String} adresseToLocate - Adresse à localiser
 */
function initLocationSearch(adresseToLocate) {
    xhr("https://api-adresse.data.gouv.fr/search/?q=" + encodeURIComponent(adresseToLocate) , displayLocationReturnInTable);
}
/**
 * Traite l'adresse demandé par l'utilisateur
 * @param {Object} evt 
 */
function onlocationformsubmit(evt) {
    evt.preventDefault();
    let adresseToLocate = document.forms["location-form"]["locationInput"].value.trim();
    initLocationSearch(adresseToLocate);
    document.querySelector("#data-information").innerHTML ="";
    $("#map").removeClass("map-start").addClass("map-aftersubmit");
    $("#map-data-content").css("display", "inline-block");
}
/**
 * Récupère le format de ligne pour remplir le tableau
 */
function launchTemplateCreation() {
    xhr("/views/tableLineTemplate.html", function (response) {
        lineTemplate.innerHTML = response;
    });
}
function bindEvents() {
    document.forms["location-form"].addEventListener("submit", onlocationformsubmit)
}
window.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    launchTemplateCreation()
})

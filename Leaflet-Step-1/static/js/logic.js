// Creating the map object





var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})
var topo = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

var myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 5,
    layers: [street]
});
var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
};


L.control.layers(baseMaps, {    // collapsed: false
}).addTo(myMap);
function getcolor(i) {
      return i > 90 ? "#EA2C2C" :
        i > 70  ? "#EA822C" :
        i > 50  ? "#EE9C00" :
        i > 30  ? "#EECC00" :
        i > 10   ?  "#D4EE00" :
                "#98EE00";
      }
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (earthquakeData) {
    // Once we get a response, send the data.features object to the createFeatures function.
    L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag*4,
                fillColor: getcolor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
           
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place +
                "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        }
    }).addTo(myMap)

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        ranges = [-10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < ranges.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getcolor(ranges[i] + 1) + '"></i> ' +
            ranges[i] + (ranges[i + 1] ? '&ndash;' + ranges[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

}); 

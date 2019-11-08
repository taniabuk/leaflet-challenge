console.log("working");

var apiKey = "pk.eyJ1IjoiZHJpdmVyYTUzNyIsImEiOiJjanZlZTJieWcwbmlsNDRwbDV1ZHRxdmxnIn0.eZ3XMovyBxLUPfWtg0VPuw";

// Create "base" map layers


var streetLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: apiKey
});


var satelliteLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: apiKey
});

var map = L.map("map", { 
  center: [51.508, -0.11],
  zoom: 2,
  layers: [streetLayer, satelliteLayer]
});

var baseMaps = {
	"Street": streetLayer,
	"Satellite": satelliteLayer
};

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
  .then(function (data) {

    
    console.log('data:', data);

    var earthquakeData = data['features'];
    var earthquakesGroup = [];

   
    for (let i = 0; i < earthquakeData.length; i++) {
   
      if (earthquakeData[i] !== undefined) {
        var coordinates = earthquakeData[i]['geometry']['coordinates']; // [-146.8124, 61.2999, 15.4]
        var lat = coordinates[1];
        var lng = coordinates[0];
        var magnitude = earthquakeData[i]['properties']['mag']; // 2.7
        var place = earthquakeData[i]['properties']['place'];

      
        var circle = L.circle([lat, lng], {
          color: getColor(magnitude),
          fillColor: getColor(magnitude),
          fillOpacity: 0.5,
          radius: 500 * magnitude
        }).bindPopup('Place: ' + place + ' - Magnitude: ' + magnitude)

       
        earthquakesGroup.push(circle);
      }

    }

    var overlayMaps = {
      "Earthquakes": L.layerGroup(earthquakesGroup)
    }
    
    L.control.layers(baseMaps, overlayMaps).addTo(map);

    // This function determines the color of the marker based on the magnitude of the earthquake.
    function getColor(magnitude) {
      switch (true) {
        case magnitude > 5:
          return "#ea2c2c";
        case magnitude > 4:
          return "#ea822c";
        case magnitude > 3:
          return "#ee9c00";
        case magnitude > 2:
          return "#eecc00";
        case magnitude > 1:
          return "#d4ee00";
        default:
          return "#98ee00";
      }
    }
  });
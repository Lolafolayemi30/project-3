// Function to initialize the map
function initMap() {
    // Map options
    var mapOptions = {
        center: { lat: 40.7128, lng: -74.0060 }, // New York City coordinates
        zoom: 12
    };

    // Create the map
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Create a marker
    var marker = new google.maps.Marker({
        position: { lat: 40.7128, lng: -74.0060 }, // New York City coordinates
        map: map,
        title: 'New York City'
    });

    // Create an info window
    var infowindow = new google.maps.InfoWindow({
        content: 'This is New York City!'
    });

    // Open the info window when marker is clicked
    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    // Create a search box
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards the map's viewport
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    // Add event listener for when a place is selected from search
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // For each place, add a marker and adjust map bounds
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

            var marker = new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location
            });

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

// Call the initMap function when the window has finished loading
window.onload = function () {
    initMap();
};

// Initialize the map with the user's current location and additional features
function initMap() {
    var mapOptions = {
        center: { lat: 41.8781, lng: -87.6298 }, // Default to Chicago coordinates
        zoom: 12
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // If running locally (using file:/// protocol), bypass geolocation and add default marker
    if (window.location.protocol === "file:") {
        handleLocationError(false);
        addDefaultMarker(map);
        addSearchBox(map);
        return;
    }

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(userLocation);
            addMarker(map, userLocation);
            addInfoWindow(map, userLocation);
            addSearchBox(map);
        }, function () {
            handleLocationError(true);
            addDefaultMarker(map);
            addSearchBox(map);
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false);
        addDefaultMarker(map);
        addSearchBox(map);
    }
}

// Function to handle errors when getting user's location
function handleLocationError(browserHasGeolocation) {
    var errorMessage = browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.';
    console.error(errorMessage);
}

// Function to add a marker at the specified location
function addMarker(map, location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Your Location'
    });
}

// Function to add an info window at the specified location
function addInfoWindow(map, location) {
    var infowindow = new google.maps.InfoWindow({
        content: 'Your Location: ' + location.lat + ', ' + location.lng
    });

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Your Location'
    });

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });
}

// Function to add a default marker (Chicago) if geolocation is not available
function addDefaultMarker(map) {
    var defaultLocation = { lat: 41.8781, lng: -87.6298 }; // Chicago coordinates
    addMarker(map, defaultLocation);
}

// Function to add a search box to the map
function addSearchBox(map) {
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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

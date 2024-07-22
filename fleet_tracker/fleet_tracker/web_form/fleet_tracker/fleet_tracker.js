frappe.ready(function() {
    var html = `
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
        <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.css' rel='stylesheet' />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">    
        <title>Olesalaton Project</title>
    </head>
    <div id="map" style="width: 100%; height: 500px;"></div>
    `;

    frappe.web_form.set_value("location", html);

    // Create and append the Mapbox script tag dynamically
    var script1 = document.createElement('script');
    script1.src = 'https://api.tiles.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.js';

    script1.onload = function() {
        console.log("Script loaded successfully.");
        // Initialize the map after the script is loaded
        mapboxgl.accessToken = 'ADD MAPBOX ACCESS TOKEN';
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-74.006, 40.7128], // Default center coordinates (New York)
            zoom: 10
        });
    };

    script1.onerror = function() {
        console.log("Error loading script.");
    };

    document.head.appendChild(script1);

    // Function to validate phone number
    function validatePhoneNumber(phone_number) {
        return /^\+\d{10,15}$/.test(phone_number);
    }

    // Event handler for clicking the "Get Location" button
    $('#get_location_button').on('click', function() {
        let phone_number = $('#phone_number').val();

        // Validate phone number format
        if (!validatePhoneNumber(phone_number)) {
            frappe.msgprint(__('Please enter a valid international phone number (e.g., +254746311377).'));
            return;
        }

        // Make an AJAX request to fetch location using S7 integration
        frappe.call({
            method: 'your_custom_app.api.get_location_via_s7',
            args: {
                phone_number: phone_number
            },
            callback: function(response) {
                console.log('Location data:', response.message);

                // Update ERPNext form fields with retrieved location
                cur_frm.set_value('latitude', response.message.latitude);
                cur_frm.set_value('longitude', response.message.longitude);

                // Initialize the map with the new location
                const map = new mapboxgl.Map({
                    container: 'map',
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [response.message.longitude, response.message.latitude],
                    zoom: 10
                });

                // Add a marker to the map at the new location
                new mapboxgl.Marker()
                    .setLngLat([response.message.longitude, response.message.latitude])
                    .addTo(map);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching location:', error);
                frappe.msgprint(__('Failed to fetch location. Please try again.'));
            }
        });
    });
});

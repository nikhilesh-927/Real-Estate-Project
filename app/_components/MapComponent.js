// src/MapComponent.js
import React, { useEffect } from 'react';

const MapComponent = () => {

  useEffect(() => {
    // Load the Google Maps script
    const script = document.createElement('script');
    script.src = "mapJavaScriptAPI.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Initialize the map once the script is loaded
    script.onload = () => {
      window.initMap = () => {
        new window.google.maps.Map(document.getElementById('map'), {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8
        });
      }
    };

    return () => {
      // Clean up the script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return <div id="map" style={{ height: '100vh', width: '100%' }}></div>;
};

export default MapComponent;

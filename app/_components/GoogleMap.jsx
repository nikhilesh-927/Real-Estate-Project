// GoogleMap.jsx
import React, { useEffect } from 'react';

const GoogleMap = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/somanchiu/Keyless-Google-Maps-API@v6.8/mapsJavaScriptAPI.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Initialize the map after the script is loaded
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    };
    document.body.appendChild(script);

    return () => {
      // Clean up script tag when component is unmounted
      document.body.removeChild(script);
    };
  }, []);

  return <div id="map" style={{ height: '100%', width: '100%' }}></div>;
};

export default GoogleMap;

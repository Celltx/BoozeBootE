import React, { useEffect } from 'react';

function Maps() {
  useEffect(() => {
    // Cargar la API de Google Maps si no está cargada
    if (!window.google) {
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };

      loadScript(`https://maps.googleapis.com/maps/api/js?key=AIzaSyBjELQaL6gIzd8hiA3pWcRxY0ow68MKZB0&libraries=places`)
        .then(() => {
          initMap();
        })
        .catch((error) => console.error("Error loading Google Maps script", error));
    } else {
      initMap();
    }

    const initMap = () => {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 19.403837203979492, lng: -98.98571014404297 },
        zoom: 14,
      });

      const marker = new google.maps.Marker({
        position: { lat: 19.403837203979492, lng: -98.98571014404297 },
        map: map,
        title: "BoozeBot",
      });

      // Al dar click se redirecciona a Google Maps 
      marker.addListener("click", () => {
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=19.403837203979492,-98.98571014404297`;
        window.open(mapsUrl, "_blank");
      });
    };

  }, []);

  return (
    <div>
      <h2>Localización de BoozeBot</h2>
      <div id="map" style={{ height: "400px", width: "100%" }}></div>
    </div>
  );
}

export default Maps;

import 'leaflet/dist/leaflet.css';
import React, { useState } from 'react';
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';
import gpxParser from 'gpxparser';

const GpxMap = () => {
  const [gpxData, setGpxData] = useState(null);

  const handleFileSelect = async () => {
    try {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';

      fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];

        if (file) {
          try {
            const reader = new FileReader();

            reader.onload = function (e) {
              const gpxContent = e.target.result;
              const parser = new gpxParser();
              parser.parse(gpxContent);

              setGpxData(parser);
            };

            reader.readAsText(file);
          } catch (error) {
            console.error('Error parsing GPX:', error);
          }
        }
      });

      fileInput.click();
    } catch (error) {
      console.error('Error loading GPX file:', error);
    }
  };

  if (!gpxData) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={handleFileSelect}>Select GPX File</button>
      </div>
    );
  }

  const positions = gpxData.tracks[0].points.map((p) => [p.lat, p.lon]);

  return (
    <div style={{ textAlign: 'center' }}>
      <MapContainer
        center={positions[0]}
        zoom={9}
        scrollWheelZoom={false}
        style={{ height: '300px', width: '250px', margin: '20px auto' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline
          pathOptions={{ fillColor: 'red', color: 'blue' }}
          positions={positions}
        />
      </MapContainer>
    </div>
  );
};

export default GpxMap;

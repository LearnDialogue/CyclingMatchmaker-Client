import 'leaflet/dist/leaflet.css';
import React, { useState, ChangeEvent } from 'react';
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';
import gpxParser from 'gpxparser';

export interface RouteInfo {
  points: [number, number][];
  elevation: number[];
  distance: number;
  max_elevation: number;
  min_elevation: number;
  total_elevation_gain: number;
  startCoordinates: [number, number];
  endCoordinates: [number, number];
}

export const extractRouteInfo = async (file: File): Promise<RouteInfo> => {
  try {
    const reader = new FileReader();
    const gpxContent = await new Promise<string>((resolve) => {
      reader.onload = (e) => {
        if (e.target) {
          resolve(e.target.result as string);
        } else {
          resolve('');
        }
      };
      reader.readAsText(file);
    });

    if (!gpxContent) {
      throw new Error('GPX content is empty');
    }

    const parser = new gpxParser();
    parser.parse(gpxContent);

    const routeInfo: RouteInfo = {

      points: parser.tracks[0].points.map((point: any) => [point.lat, point.lon]),
      elevation: parser.tracks[0].points.map((point: any) => point.ele),
      distance: parser.tracks[0].distance.total,
      max_elevation: parser.tracks[0].elevation.max,
      min_elevation: parser.tracks[0].elevation.min,
      total_elevation_gain: parser.tracks[0].elevation.max - parser.tracks[0].elevation.min,
      startCoordinates: [
        parser.tracks[0].points[0].lat, parser.tracks[0].points[0].lon
      ],
      endCoordinates: [
        parser.tracks[0].points[parser.tracks[0].points.length - 1].lat,
        parser.tracks[0].points[parser.tracks[0].points.length - 1].lon,
      ],
    };

    console.log('Route Information:', routeInfo);

    return routeInfo;
  } catch (error) {
    console.error('Error extracting route information from GPX:', error);
    throw error;
  }
};

const GpxMap: React.FC = () => {
  const [routeData, setRouteData] = useState<RouteInfo | null>(null);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];

      if (file) {
        try {
          const routeInfo = await extractRouteInfo(file);

          // Set the route data state
          setRouteData(routeInfo);
        } catch (error) {
          console.error('Error parsing GPX:', error);
        }
      }
    } catch (error) {
      console.error('Error loading GPX file:', error);
    }
  };

  if (!routeData) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <input type="file" onChange={handleFileSelect} />
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <MapContainer
        center={routeData.startCoordinates}
        zoom={9}
        scrollWheelZoom={false}
        style={{ height: '300px', width: '250px', margin: '20px auto' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline
          pathOptions={{ fillColor: 'red', color: 'blue' }}
          positions={routeData.points}
        />
      </MapContainer>
    </div>
  );
};

export default GpxMap;
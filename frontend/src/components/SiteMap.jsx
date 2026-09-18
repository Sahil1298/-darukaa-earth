import { useEffect, useRef } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

function SiteMap({ sites }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = L.map(mapContainerRef.current).setView(
      [20.5937, 78.9629],
      5
    );

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }
    ).addTo(map);

    mapRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    markersRef.current.forEach((marker) => {
      marker.remove();
    });

    markersRef.current = [];

    if (!sites || sites.length === 0) {
      map.setView([20.5937, 78.9629], 5);
      return;
    }

    const bounds = [];

    sites.forEach((site) => {
      const latitude = Number(site.latitude);
      const longitude = Number(site.longitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        return;
      }

      const markerIcon = L.divIcon({
        className: "site-marker",
        html: "<div></div>",
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const marker = L.marker(
        [latitude, longitude],
        {
          icon: markerIcon,
        }
      ).addTo(map);

      const popupContent =
        document.createElement("div");

      const title =
        document.createElement("strong");

      title.textContent = site.name;

      const area =
        document.createElement("p");

      area.textContent =
        `Area: ${site.area_hectares} hectares`;

      const coordinates =
        document.createElement("p");

      coordinates.textContent =
        `Coordinates: ${latitude}, ${longitude}`;

      popupContent.appendChild(title);
      popupContent.appendChild(area);
      popupContent.appendChild(coordinates);

      marker.bindPopup(popupContent);

      markersRef.current.push(marker);

      bounds.push([latitude, longitude]);
    });

    if (bounds.length === 1) {
      map.setView(bounds[0], 12);
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 12,
      });
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      markersRef.current.forEach((marker) => {
        marker.remove();
      });

      markersRef.current = [];
    };
  }, [sites]);

  return (
    <div className="site-map-wrapper">
      <div
        ref={mapContainerRef}
        className="site-map"
      />
    </div>
  );
}

export default SiteMap;
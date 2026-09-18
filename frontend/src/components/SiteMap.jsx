import { useEffect, useRef } from "react";

import * as mapboxgl from "mapbox-gl/esm";
import "mapbox-gl/dist/mapbox-gl.css";

function SiteMap({ sites }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    if (!mapboxToken) {
      console.error(
        "Mapbox token is missing. Set VITE_MAPBOX_TOKEN in frontend/.env."
      );
      return;
    }

    const map = new mapboxgl.Map({
      accessToken: mapboxToken,
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [78.9629, 20.5937],
      zoom: 4,
    });

    mapRef.current = map;

    map.once("load", () => {
      map.resize();
    });

    const resizeTimer = setTimeout(() => {
      map.resize();
    }, 100);

    return () => {
      clearTimeout(resizeTimer);

      markersRef.current.forEach((marker) => {
        marker.remove();
      });

      markersRef.current = [];

      map.remove();
      mapRef.current = null;
    };
  }, [mapboxToken]);

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
      map.flyTo({
        center: [78.9629, 20.5937],
        zoom: 4,
        duration: 500,
      });

      return;
    }

    const validSites = sites
      .map((site) => {
        const latitude = Number(site.latitude);
        const longitude = Number(site.longitude);

        return {
          ...site,
          latitude,
          longitude,
        };
      })
      .filter(
        (site) =>
          Number.isFinite(site.latitude) &&
          Number.isFinite(site.longitude)
      );

    if (validSites.length === 0) {
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();

    validSites.forEach((site) => {
      const popupContent = document.createElement("div");

      const title = document.createElement("strong");
      title.textContent = site.name;

      const area = document.createElement("p");
      area.textContent = `Area: ${site.area_hectares} hectares`;

      const coordinates = document.createElement("p");
      coordinates.textContent = `Coordinates: ${site.latitude}, ${site.longitude}`;

      popupContent.appendChild(title);
      popupContent.appendChild(area);
      popupContent.appendChild(coordinates);

      const popup = new mapboxgl.Popup({
        offset: 25,
      }).setDOMContent(popupContent);

      const marker = new mapboxgl.Marker()
        .setLngLat([site.longitude, site.latitude])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);

      bounds.extend([site.longitude, site.latitude]);
    });

    if (validSites.length === 1) {
      map.flyTo({
        center: [
          validSites[0].longitude,
          validSites[0].latitude,
        ],
        zoom: 12,
        duration: 700,
      });
    } else {
      map.fitBounds(bounds, {
        padding: 60,
        maxZoom: 12,
        duration: 700,
      });
    }

    const resizeTimer = setTimeout(() => {
      map.resize();
    }, 100);

    return () => {
      clearTimeout(resizeTimer);

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
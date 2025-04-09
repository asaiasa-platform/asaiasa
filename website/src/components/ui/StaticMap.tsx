"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";

export default function StaticMap({
  lat,
  lng,
}: Readonly<{ lat: number; lng: number }>) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleMapLinkClick = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank"
    );
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: 14,
      dragPan: false, // Prevent map dragging
      scrollZoom: false, // Optional: Prevent zooming with scroll
      doubleClickZoom: false, // Optional: Disable double-click zoom
    });

    new mapboxgl.Marker({ color: "#FF6400" }).setLngLat([lng, lat]).addTo(map);

    return () => map.remove(); // Cleanup map on unmount
  }, [lat, lng]);
  return (
    <div className="relative w-full h-full">
      <button
        onClick={handleMapLinkClick}
        className="absolute flex justify-center items-center z-10 top-2 right-2 
      bg-white/80 py-1 px-2 rounded-[8px] border border-orange-dark hover:drop-shadow-md"
      >
        <Image
          src="/icon/google-map.png"
          className="h-6 md:h-7 w-auto"
          width={100}
          height={100}
          alt="map-link"
        />
        <span className="text-sm md:text-base">ลิ้งค์ Google Map</span>
      </button>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}

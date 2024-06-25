import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

export const useClusterer = (map: google.maps.Map | null, destinations: (google.maps.LatLngLiteral & { title: string })[]) => {
  const markerLibrary = useMapsLibrary("marker");

  const [clustering, setClustering] = useState<MarkerClusterer>();

  useEffect(() => {
    return () => clustering?.clearMarkers();
  }, [clustering])
  
  useEffect(() => {
    async function addMarkers() {
      if (!markerLibrary) return;

      const { AdvancedMarkerElement, PinElement } = markerLibrary;
    
      const infoWindow = new google.maps.InfoWindow({
        disableAutoPan: true,
      });
  
      const markers = destinations.map((destination, i) => {
        const pinGlyph = new PinElement({
          glyph: `${i+1}`,
          glyphColor: "white",
          background: "blue",
          borderColor: "black",
          scale: 0.8
        })
        const marker = new AdvancedMarkerElement({
          content: pinGlyph.element,
          position: destination,
        });
      
        marker.addListener("click", () => {
          infoWindow.setContent(destination.title);
          infoWindow.open(map, marker);
        });
        
        return marker;
      });

      setClustering(new MarkerClusterer({ markers, map }));
    };

    void addMarkers();
  }, [map, destinations, markerLibrary]);
};

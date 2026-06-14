import React, { useEffect } from "react";
import locationsHeroImg from "@/assets/images/locations-hero.png";
import { useListLocations } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Map } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ── Fix Leaflet default marker icons in Vite/bundler env ── */
const greenIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 36px; height: 36px;
    background: #66CC00;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.35);
  "></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -38],
});

const CDO_CENTER: [number, number] = [8.4875, 124.6417];

export default function Locations() {
  const { data: locations, isLoading } = useListLocations();

  /* Patch Leaflet icon urls that break in Vite */
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img
            src={locationsHeroImg}
            alt="C7 Store Locations"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-6 tracking-tight drop-shadow-lg">
            Find a C7 Near You
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto font-medium text-zinc-100">
            With branches across CDO, convenience is always just around the corner.
          </p>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="relative w-full" style={{ height: "480px" }}>
        <div className="absolute inset-0 z-0">
          <MapContainer
            center={CDO_CENTER}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations?.map((loc) =>
              loc.lat && loc.lng ? (
                <Marker
                  key={loc.id}
                  position={[Number(loc.lat), Number(loc.lng)]}
                  icon={greenIcon}
                >
                  <Popup>
                    <div className="text-sm min-w-[160px]">
                      <p className="font-bold text-base mb-1" style={{ color: "#66CC00" }}>
                        {loc.name}
                      </p>
                      <p className="text-gray-600 mb-1">{loc.address}</p>
                      <p className="text-gray-500 text-xs mb-2">Near: {loc.landmark}</p>
                      <p className="font-semibold mb-2" style={{ color: "#66CC00" }}>
                        {loc.hours}
                      </p>
                      <a
                        href={loc.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          background: "#66CC00",
                          color: "#fff",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          textDecoration: "none",
                        }}
                      >
                        Get Directions
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ) : null
            )}
          </MapContainer>
        </div>
        {/* Map overlay label */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-sm px-5 py-2 rounded-full shadow-lg pointer-events-none">
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Click any pin to see branch details
          </p>
        </div>
      </section>

      {/* Branch Directory */}
      <section className="py-16 md:py-24 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Our Branches in CDO
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-zinc-200 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations?.map((loc) => (
                <Card
                  key={loc.id}
                  className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group bg-white"
                >
                  <div className="h-1.5 bg-primary w-full" />
                  <CardContent className="p-6">
                    <h3 className="text-xl font-heading font-bold mb-4 group-hover:text-primary transition-colors">
                      {loc.name}
                    </h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{loc.address}</p>
                          {loc.landmark && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Near: {loc.landmark}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-bold text-primary">
                          {loc.hours || "Open 24/7"}
                        </span>
                      </div>
                    </div>

                    <Button className="w-full font-bold" size="sm" asChild>
                      <a href={loc.mapsUrl} target="_blank" rel="noopener noreferrer">
                        <Map className="mr-2 h-4 w-4" /> Get Directions
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

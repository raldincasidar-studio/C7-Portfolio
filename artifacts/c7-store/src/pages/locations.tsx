import React from "react";
import locationsHeroImg from "@/assets/images/locations-hero.png";
import { useListLocations } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Map } from "lucide-react";

export default function Locations() {
  const { data: locations, isLoading } = useListLocations();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src={locationsHeroImg} 
            alt="C7 Store Locations" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-6 tracking-tight text-white drop-shadow-lg">
            Find a C7 Near You
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto font-medium text-zinc-100">
            With branches across CDO, convenience is always just around the corner.
          </p>
        </div>
      </section>

      {/* Directory Section */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Our Branches in CDO</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8"></div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-zinc-200 animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {locations?.map((loc) => (
                <Card key={loc.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group bg-white">
                  <div className="h-2 bg-primary w-full"></div>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-heading font-bold mb-4 group-hover:text-primary transition-colors">{loc.name}</h3>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">{loc.address}</p>
                          {loc.landmark && <p className="text-sm text-muted-foreground mt-1">Near: {loc.landmark}</p>}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                        <span className="font-bold text-primary">{loc.hours || "Open 24/7"}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full font-bold group-hover:bg-primary/90" asChild>
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

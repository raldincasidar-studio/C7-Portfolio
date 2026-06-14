import React from "react";
import { Link } from "wouter";
import { useGetStats, useListLocations, useListProducts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/cart-context";

import homeHeroImg from "@/assets/images/home-hero.png";

export default function Home() {
  const { data: stats } = useGetStats();
  const { data: locations } = useListLocations();
  const { data: featuredProducts } = useListProducts({ featured: true });
  const { addItem } = useCart();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src={homeHeroImg} 
            alt="C7 Store Interior" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 tracking-tight text-white drop-shadow-lg">
            Always Open. <span className="text-primary">Always Near.</span><br />Always C7.
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto font-medium text-zinc-100">
            Your trusted 24/7 neighborhood convenience store in Cagayan de Oro.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full font-bold shadow-xl hover:scale-105 transition-transform">
            <Link href="/locations">Find Your Nearest Branch</Link>
          </Button>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-primary text-primary-foreground py-8 border-y-4 border-primary-foreground/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-heading font-bold">{stats?.totalLocations || 8}+</p>
              <p className="text-sm font-medium opacity-90 uppercase tracking-wider">Branches</p>
            </div>
            <div>
              <p className="text-4xl font-heading font-bold">24/7</p>
              <p className="text-sm font-medium opacity-90 uppercase tracking-wider">Open</p>
            </div>
            <div>
              <p className="text-4xl font-heading font-bold">{stats?.totalProducts || 1200}+</p>
              <p className="text-sm font-medium opacity-90 uppercase tracking-wider">Products</p>
            </div>
            <div>
              <p className="text-4xl font-heading font-bold">100%</p>
              <p className="text-sm font-medium opacity-90 uppercase tracking-wider">Local Pride</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose C7 */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">Why Choose C7?</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition-colors duration-300">
                <Clock className="h-10 w-10 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">24/7 Reliability</h3>
              <p className="text-muted-foreground leading-relaxed">
                Open when everyone else is closed. We are here for your midnight cravings, early morning needs, and everything in between.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition-colors duration-300">
                <MapPin className="h-10 w-10 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Right in Your Neighborhood</h3>
              <p className="text-muted-foreground leading-relaxed">
                With branches spread across Cagayan de Oro, there's always a C7 nearby. Convenience is truly just around the corner.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition-colors duration-300">
                <ShoppingBag className="h-10 w-10 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Everything You Need</h3>
              <p className="text-muted-foreground leading-relaxed">
                From hot meals and cold beverages to daily household essentials and local favorites, our shelves are fully stocked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-heading font-bold text-foreground mb-4">Featured Essentials</h2>
              <div className="w-24 h-1 bg-primary rounded-full"></div>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex font-bold hover:text-primary">
              <Link href="/products">View All Products <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts?.slice(0, 4).map((product) => (
              <Card key={product.id} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group">
                <div className="aspect-square bg-white relative overflow-hidden p-4">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-100 rounded-lg">
                      <ShoppingBag className="h-12 w-12 text-zinc-300" />
                    </div>
                  )}
                  {product.featured && (
                    <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">Top Pick</span>
                  )}
                </div>
                <CardContent className="p-4 bg-white border-t">
                  <p className="text-xs text-muted-foreground font-medium mb-1">{product.categoryName}</p>
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-primary text-lg">₱{product.price.toFixed(2)}</p>
                    <Button size="sm" onClick={() => addItem(product)}>Add</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Locations */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">Across the City of Golden Friendship</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">Find a C7 Convenience Store near you.</p>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {locations?.slice(0, 3).map((loc) => (
              <Card key={loc.id} className="border bg-zinc-50 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-bold mb-2">{loc.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 h-10">{loc.address}</p>
                  <div className="flex items-center text-sm font-medium text-primary mb-6">
                    <Clock className="h-4 w-4 mr-2" /> Open 24/7
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={loc.mapsUrl} target="_blank" rel="noopener noreferrer">Get Directions</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/locations">View All Locations</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

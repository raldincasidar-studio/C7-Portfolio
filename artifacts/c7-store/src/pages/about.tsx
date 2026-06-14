import React from "react";
import aboutHeroImg from "@/assets/images/about-hero.png";
import { CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src={aboutHeroImg} 
            alt="C7 Store Team" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-6 tracking-tight text-white drop-shadow-lg">
            The C7 Story: Rooted in CDO
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto font-medium text-zinc-100">
            Building a legacy of convenience, one neighborhood at a time.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl font-heading font-bold text-primary mb-6 text-center">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-center">
                To provide the people of Cagayan de Oro with uncompromised 24/7 access to quality daily essentials, food, and services, creating a friendly, reliable, and uniquely local shopping experience right in their own neighborhoods.
              </p>
            </div>
            
            <div className="mb-16">
              <h2 className="text-3xl font-heading font-bold text-primary mb-6 text-center">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-center">
                To be the most trusted and preferred neighborhood convenience store chain in Northern Mindanao, deeply integrated into the communities we serve and recognized for our vibrant energy and steadfast reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community First */}
      <section className="py-24 bg-zinc-50 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-heading font-bold text-foreground mb-6">Community First, Always</h2>
              <div className="w-24 h-1 bg-primary mb-8 rounded-full"></div>
              
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                C7 isn't just a corporate chain dropping pins on a map. We are born and raised in Cagayan de Oro, the City of Golden Friendship. We know what our neighbors want because we are your neighbors.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Supporting local CDO suppliers and products",
                  "Employing people from within the neighborhoods we serve",
                  "Maintaining well-lit, safe spaces that improve neighborhood security",
                  "Operating truly 24/7, 365 days a year"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={aboutHeroImg} 
                alt="Community Focus" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

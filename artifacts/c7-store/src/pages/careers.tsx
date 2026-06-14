import React from "react";
import { Link } from "wouter";
import careersHeroImg from "@/assets/images/careers-hero.png";
import { useListJobs } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Briefcase, MapPin, Users, HeartHandshake } from "lucide-react";

export default function Careers() {
  const { data: jobs, isLoading } = useListJobs();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src={careersHeroImg} 
            alt="C7 Store Careers" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-6 tracking-tight text-white drop-shadow-lg">
            Join the C7 Family
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto font-medium text-zinc-100">
            Build your career with CDO's fastest-growing convenience store chain.
          </p>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Why Work With Us?</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 rounded-2xl bg-zinc-50 border text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-4">A Real Team</h3>
              <p className="text-muted-foreground leading-relaxed">
                We're a tight-knit family that looks out for each other. At C7, you're not just a number on a payroll.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-zinc-50 border text-center">
              <HeartHandshake className="h-12 w-12 text-primary mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-4">Growth Opportunities</h3>
              <p className="text-muted-foreground leading-relaxed">
                As we expand across Cagayan de Oro, so do opportunities for our staff to step up into management roles.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-zinc-50 border text-center">
              <Briefcase className="h-12 w-12 text-primary mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-4">Competitive Benefits</h3>
              <p className="text-muted-foreground leading-relaxed">
                We offer competitive local rates, night differential pay, and a supportive working environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24 bg-zinc-50 border-t">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-2 text-center">Open Positions</h2>
          <p className="text-muted-foreground text-center mb-10">Find where you fit in our growing team.</p>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-zinc-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : jobs && jobs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {jobs.map((job) => (
                <AccordionItem key={job.id} value={`job-${job.id}`} className="bg-white border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center text-left w-full gap-2 sm:gap-6">
                      <span className="text-xl font-bold text-primary">{job.title}</span>
                      <div className="flex items-center text-muted-foreground text-sm font-normal">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location || "Multiple Branches, CDO"}
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm font-normal">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {job.type || "Full-time"}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-2 border-t">
                    <div className="prose prose-zinc max-w-none">
                      <h4 className="font-bold text-lg mb-2">Requirements:</h4>
                      <p className="whitespace-pre-wrap text-muted-foreground">{job.requirements}</p>
                    </div>
                    <div className="mt-8">
                      <Button size="lg" className="font-bold px-8" asChild>
                        <Link href={`/contact?subject=Application:%20${encodeURIComponent(job.title)}`}>
                          Apply Now
                        </Link>
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border">
              <p className="text-muted-foreground mb-4">No open positions at the moment, but we're always looking for great talent!</p>
              <Button variant="outline" asChild>
                <Link href="/contact">Send General Inquiry</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

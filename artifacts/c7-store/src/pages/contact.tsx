import React from "react";
import contactHeroImg from "@/assets/images/contact-hero.png";
import { useSubmitContact } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Phone, MapPin, Mail, Facebook, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { mutate: submitContact, isPending } = useSubmitContact();
  const { toast } = useToast();
  
  // Try to get subject from URL (used by careers page)
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const defaultSubject = searchParams.get("subject") || "";

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: defaultSubject,
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof contactSchema>) => {
    submitContact(
      { data },
      {
        onSuccess: () => {
          toast({
            title: "Message Sent!",
            description: "Thank you for reaching out. We will get back to you soon.",
          });
          form.reset();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Failed to send",
            description: "There was a problem sending your message. Please try again.",
          });
        },
      }
    );
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src={contactHeroImg} 
            alt="C7 Contact" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4 tracking-tight text-white drop-shadow-lg">
            We Would Love to Hear From You
          </h1>
          <p className="text-xl max-w-2xl mx-auto font-medium text-zinc-100">
            Questions, feedback, or business inquiries? Get in touch with us.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-5 gap-12">
            
            {/* Contact Info */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-heading font-bold mb-6">Contact Information</h2>
                <div className="w-16 h-1 bg-primary mb-8 rounded-full"></div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-4">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone</h3>
                    <p className="text-muted-foreground">+63 88 881 1681</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-4">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Main Office</h3>
                    <p className="text-muted-foreground">Tomas Saco Corner 8th Street<br />Cagayan de Oro, Philippines</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-4">
                    <Facebook className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Social Media</h3>
                    <p className="text-muted-foreground">@c7conveniencestore</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-3">
              <Card className="border-none shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold">Your Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Juan dela Cruz" className="bg-zinc-50" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold">Your Email</FormLabel>
                              <FormControl>
                                <Input placeholder="juan@example.com" type="email" className="bg-zinc-50" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold">Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="What is this regarding?" className="bg-zinc-50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold">Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="How can we help you?" 
                                className="min-h-[150px] bg-zinc-50 resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" size="lg" className="w-full font-bold text-lg" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        Send Message
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: (data: ContactFormData) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you soon.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contact-submissions"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again later.",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="pt-16">
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h1 className="text-3xl md:text-4xl font-inter font-bold mb-4">
                Get In <span className="gradient-text-primary">Touch</span>
              </h1>
              <p className="text-xl text-muted max-w-3xl mx-auto">
                Ready to transform your product images? Let's discuss your project and create something amazing together.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <ScrollReveal>
              <Card className="card-luxury">
                <CardContent className="p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="+92-300-1234567" type="tel" {...field} />
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
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about your project..." 
                                rows={6}
                                className="resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full btn-luxury py-3 px-6 rounded-lg font-medium uppercase tracking-wide"
                        disabled={contactMutation.isPending}
                      >
                        {contactMutation.isPending ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </ScrollReveal>
            
            {/* Contact Information */}
            <ScrollReveal delay={200}>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-inter font-semibold mb-6 gradient-text-secondary">Connect With Us</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-accent-cyan mr-4" />
                      <span className="text-muted">visioncraftlabs@gmail.com</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-accent-cyan mr-4" />
                      <span className="text-muted">+1-647-8324443</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-accent-cyan mr-4" />
                      <span className="text-muted">Toronto, Canada</span>
                    </div>
                  </div>
                </div>
                
                {/* Social Media Links */}
                <div>
                  <h4 className="text-lg font-inter font-semibold mb-4 gradient-text-secondary">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a 
                      href="https://www.instagram.com/visioncraft_labs/?next=%2F" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="card-luxury p-3 rounded-lg hover:scale-105 transition-all duration-300 group"
                    >
                      <Instagram className="h-6 w-6 text-accent-cyan group-hover:text-accent-pink transition-colors" />
                    </a>
                    <a 
                      href="https://www.facebook.com/people/Visioncraft-Labs/61577453503470/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="card-luxury p-3 rounded-lg hover:scale-105 transition-all duration-300 group"
                    >
                      <Facebook className="h-6 w-6 text-accent-cyan group-hover:text-accent-pink transition-colors" />
                    </a>
                    <a 
                      href="https://x.com/VisioncraftLabs" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="card-luxury p-3 rounded-lg hover:scale-105 transition-all duration-300 group"
                    >
                      <Twitter className="h-6 w-6 text-accent-cyan group-hover:text-accent-pink transition-colors" />
                    </a>
                  </div>
                </div>
                
                {/* Map Placeholder */}
                <Card className="bg-primary">
                  <CardContent className="p-8 text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Interactive Map</p>
                    <p className="text-sm text-gray-400 mt-2">Google Maps integration would go here</p>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

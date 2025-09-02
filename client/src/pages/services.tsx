import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";

const Services = () => {
  const packages = [
    {
      name: "Silver",
      price: "$ 300",
      description: "Perfect for startups",
      features: [
        "Up to 7 product images",
        "Basic background removal",
        "Color correction",
        "Standard lighting enhancement",
        "7-day delivery",
        "1 revision rounds"
      ],
      buttonClass: "btn-luxury",
      cardClass: "card-luxury hover:scale-105"
    },
    {
      name: "Gold",
      price: "$ 500",
      description: "Ideal for growing businesses",
      features: [
        "Up to 15 product images",
        "Advanced background replacement",
        "Professional color grading",
        "Premium lighting & shadows",
        "Lifestyle scene creation",
        "5-day delivery",
        "2 revision rounds"
      ],
      buttonClass: "btn-secondary",
      cardClass: "card-luxury bg-gradient-to-br from-orange-500/10 to-pink-500/10 border-2 border-accent-orange/30 transform scale-105 shadow-2xl",
      popular: true
    },
    {
      name: "Platinum",
      price: "$ 1,000",
      description: "Enterprise solution",
      features: [
        "Up to 30 product images",
        "Custom scene creation",
        "Advanced compositing",
        "Cinema-grade lighting",
        "Brand-specific styling",
        "3-day delivery",
        "5 revisions",
        "Dedicated account manager"
      ],
      buttonClass: "gradient-bg-primary text-white font-semibold",
      cardClass: "card-luxury bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-2 border-accent-purple/30 hover:scale-105"
    }
  ];

  return (
    <div className="pt-16">
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h1 className="text-3xl md:text-4xl font-inter font-bold mb-4">Our Service Packages</h1>
              <p className="text-xl text-muted max-w-3xl mx-auto">
                Choose the perfect package for your brand's needs. All packages include professional editing and fast delivery.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <ScrollReveal key={pkg.name} delay={index * 100}>
                <Card className={`relative p-8 ${pkg.cardClass} transition-all hover:shadow-lg`}>
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="gradient-bg-secondary text-white px-4 py-1 rounded-full text-sm font-medium uppercase tracking-wide">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <CardContent className="p-0">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-inter font-bold mb-2 gradient-text-primary">{pkg.name}</h3>
                      <div className="text-4xl font-bold mb-2 gradient-text-secondary">
                        {pkg.price}
                      </div>
                      <p className="text-muted">{pkg.description}</p>
                    </div>
                    
                    <ul className="space-y-4 mb-8">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-5 w-5 text-accent-cyan mr-3 flex-shrink-0" />
                          <span className="text-muted">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link href="/contact">
                      <Button className={`w-full py-3 px-6 rounded-lg font-medium uppercase tracking-wide transition-all duration-300 ${pkg.buttonClass}`}>
                        Choose {pkg.name}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;

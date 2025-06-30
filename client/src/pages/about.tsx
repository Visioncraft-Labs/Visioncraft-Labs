import ScrollReveal from "@/components/scroll-reveal";

const About = () => {
  const processSteps = [
    {
      number: "1",
      title: "Consultation & Planning",
      description: "Understanding your brand vision and requirements"
    },
    {
      number: "2",
      title: "Creative Enhancement",
      description: "Professional editing and visual storytelling"
    },
    {
      number: "3",
      title: "Review & Refinement",
      description: "Collaborative feedback and final adjustments"
    },
    {
      number: "4",
      title: "Delivery & Support",
      description: "High-quality files ready for your campaigns"
    }
  ];

  return (
    <div className="pt-16">
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h1 className="text-3xl md:text-4xl font-inter font-bold mb-6">
                About <span className="gradient-text-primary">VisionCraft Labs</span>
              </h1>
              <p className="text-lg text-muted mb-6 leading-relaxed max-w-3xl mx-auto">
                We're passionate about transforming ordinary product photography into extraordinary visual experiences. 
                Our team of skilled designers and photographers specializes in creating compelling visual narratives 
                that help brands stand out in competitive markets.
              </p>
              <p className="text-lg text-muted mb-8 leading-relaxed max-w-3xl mx-auto">
                Founded with the mission to democratize high-end product photography, we combine cutting-edge 
                techniques with artistic vision to deliver results that exceed expectations and drive real business growth.
              </p>
            </div>
          </ScrollReveal>
          
          {/* Visual Process Section */}
          <ScrollReveal delay={200}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-inter font-bold mb-4 gradient-text-secondary">Our Process</h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                From concept to delivery, we follow a proven methodology that ensures exceptional results every time.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {processSteps.map((step, index) => (
              <ScrollReveal key={step.number} delay={index * 100}>
                <div className="card-luxury p-8 text-center relative overflow-hidden group hover:scale-105 transition-all duration-300">
                  {/* Background gradient effect */}
                  <div className="absolute inset-0 gradient-bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  
                  {/* Step number with enhanced styling */}
                  <div className="relative z-10">
                    <div className="gradient-bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-6 shadow-xl">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-inter font-bold mb-4 gradient-text-primary">{step.title}</h3>
                    <p className="text-muted leading-relaxed">{step.description}</p>
                  </div>
                  
                  {/* Connection line to next step */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 gradient-bg-secondary opacity-30"></div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
          
          {/* Team Quote Section */}
          <ScrollReveal delay={600}>
            <div className="card-luxury p-12 text-center max-w-4xl mx-auto">
              <div className="mb-6">
                <div className="w-20 h-20 gradient-bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">RF</span>
                </div>
                <h4 className="text-xl font-inter font-bold gradient-text-primary">Rayan Faisal</h4>
                <p className="text-muted">Founder & Creative Director</p>
              </div>
              <blockquote className="text-xl text-muted italic leading-relaxed">
                "Every product has a story waiting to be told. We help brands tell those stories through 
                powerful visuals that connect with customers on an emotional level."
              </blockquote>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default About;

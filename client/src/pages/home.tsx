import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import BeforeAfterImage from "@/components/before-after-image";
import ScrollReveal from "@/components/scroll-reveal";

// NEW: import from @assets (-> attached_assets)
import heroBefore from "@assets/home/hero-before.jpg";
import heroAfter from "@assets/home/hero-after.jpg";

import pfElectronicsBefore from "@assets/home/pf-electronics-before.jpg";
import pfElectronicsAfter from "@assets/home/pf-electronics-after.jpg";
import pfFashionBefore from "@assets/home/pf-fashion-before.jpg";
import pfFashionAfter from "@assets/home/pf-fashion-after.jpg";
import pfBeautyBefore from "@assets/home/pf-beauty-before.jpg";
import pfBeautyAfter from "@assets/home/pf-beauty-after.jpg";

const Home = () => {
  const portfolioItems = [
    {
      beforeImage: pfElectronicsBefore,
      afterImage: pfElectronicsAfter,
      beforeAlt: "Headphones before styling",
      afterAlt: "Headphones after styling",
      title: "Studio Enhancement",
      category: "Electronics",
    },
    {
      beforeImage: pfFashionBefore,
      afterImage: pfFashionAfter,
      beforeAlt: "Sneakers before styling",
      afterAlt: "Sneakers after styling",
      title: "Lifestyle Styling",
      category: "Fashion",
    },
    {
      beforeImage: pfBeautyBefore,
      afterImage: pfBeautyAfter,
      beforeAlt: "Perfume before styling",
      afterAlt: "Perfume after styling",
      title: "Commercial Grade",
      category: "Beauty",
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="pt-8 pb-16 bg-gradient-to-br from-primary via-bg-secondary to-bg-tertiary relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-inter font-bold leading-tight">
                Where Products Become{" "}
                <span className="gradient-text-primary">Visual Stories</span>
              </h1>
              <p className="text-xl text-muted leading-relaxed">
                Transform your dull product images into high-end visual masterpieces that captivate customers and drive sales. Professional photography services for brands and e-commerce sellers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/portfolio">
                  <Button className="btn-luxury px-8 py-4 rounded-lg">View Portfolio</Button>
                </Link>
                <Link href="/contact">
                  <Button className="btn-secondary px-8 py-4 rounded-lg">Get Started</Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <BeforeAfterImage
                beforeImage={heroBefore}
                afterImage={heroAfter}
                beforeAlt="Luxury watch before transformation"
                afterAlt="Luxury watch after transformation"
                className="rounded-2xl shadow-2xl overflow-hidden h-96"
              />
              <div className="absolute -bottom-4 -right-4 gradient-bg-secondary p-4 rounded-lg shadow-lg">
                <p className="text-sm font-medium text-white">Hover to see transformation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-20 bg-secondary relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-inter font-bold mb-4">
                Our <span className="gradient-text-secondary">Transformations</span>
              </h2>
              <p className="text-xl text-muted max-w-3xl mx-auto">
                See how we turn ordinary product photos into extraordinary visual experiences that sell.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="group">
                  <BeforeAfterImage
                    beforeImage={item.beforeImage}
                    afterImage={item.afterImage}
                    beforeAlt={item.beforeAlt}
                    afterAlt={item.afterAlt}
                    className="rounded-xl shadow-lg overflow-hidden h-64"
                  />
                  <div className="p-4">
                    <h3 className="font-inter font-semibold text-lg">{item.title}</h3>
                    <p className="text-muted">{item.category}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="text-center mt-12">
              <Link href="/portfolio">
                <Button className="btn-secondary px-8 py-4 rounded-lg">View Full Portfolio</Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Home;

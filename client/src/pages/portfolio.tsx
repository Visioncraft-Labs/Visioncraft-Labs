import { useState } from "react";
import { Button } from "@/components/ui/button";
import BeforeAfterImage from "@/components/before-after-image";
import ScrollReveal from "@/components/scroll-reveal";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const portfolioItems = [
    {
      category: "studio",
      beforeImage: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      afterImage: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      beforeAlt: "Camera before styling",
      afterAlt: "Camera after styling"
    },
    {
      category: "lifestyle",
      beforeImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      afterImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      beforeAlt: "Coffee cup before styling",
      afterAlt: "Coffee cup after styling"
    },
    {
      category: "commercial",
      beforeImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      afterImage: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      beforeAlt: "Smartphone before styling",
      afterAlt: "Smartphone after styling"
    },
    {
      category: "studio",
      beforeImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      afterImage: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      beforeAlt: "Jewelry before styling",
      afterAlt: "Jewelry after styling"
    },
    {
      category: "lifestyle",
      beforeImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      afterImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      beforeAlt: "Clothing before styling",
      afterAlt: "Clothing after styling"
    },
    {
      category: "commercial",
      beforeImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      afterImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      beforeAlt: "Beauty product before styling",
      afterAlt: "Beauty product after styling"
    },
    {
      category: "studio",
      beforeImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      afterImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      beforeAlt: "Home decor before styling",
      afterAlt: "Home decor after styling"
    },
    {
      category: "lifestyle",
      beforeImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      afterImage: "https://images.unsplash.com/photo-1593104812860-0d8ab2651cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      beforeAlt: "Sports equipment before styling",
      afterAlt: "Sports equipment after styling"
    }
  ];

  const filteredItems = activeFilter === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  const filters = [
    { name: "All", value: "all" },
    { name: "Studio", value: "studio" },
    { name: "Lifestyle", value: "lifestyle" },
    { name: "Commercial", value: "commercial" }
  ];

  return (
    <div className="pt-16">
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h1 className="text-3xl md:text-4xl font-inter font-bold mb-4">Complete Portfolio</h1>
              <p className="text-xl text-muted max-w-3xl mx-auto">
                Explore our comprehensive gallery of product transformations across different styles and industries.
              </p>
            </div>
          </ScrollReveal>
          
          {/* Portfolio Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <Button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-6 py-3 rounded-lg font-medium uppercase tracking-wide transition-all duration-300 ${
                  activeFilter === filter.value
                    ? "btn-luxury"
                    : "card-luxury text-primary-text hover:gradient-text-primary"
                }`}
              >
                {filter.name}
              </Button>
            ))}
          </div>
          
          {/* Portfolio Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <ScrollReveal key={index} delay={index * 50}>
                <BeforeAfterImage
                  beforeImage={item.beforeImage}
                  afterImage={item.afterImage}
                  beforeAlt={item.beforeAlt}
                  afterAlt={item.afterAlt}
                  className="rounded-xl shadow-lg overflow-hidden h-64"
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;

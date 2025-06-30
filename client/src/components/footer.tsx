import { Link } from "wouter";
import { Instagram, Facebook, Twitter } from "lucide-react";
import Logo from "@/components/logo";

const Footer = () => {
  return (
    <footer className="bg-primary-text text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo size="lg" className="mb-4" />
            <p className="text-gray-300 mb-6 max-w-md">
              Transforming ordinary product images into extraordinary visual stories that captivate 
              customers and drive sales for brands worldwide.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/visioncraft_labs/?next=%2F" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-accent-cyan transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?viewas=100000686899395&id=61577453503470" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-accent-cyan transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href="https://x.com/VisioncraftLabs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-accent-cyan transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-inter font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/portfolio">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    Portfolio
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    Services
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/preview">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    Preview
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    About
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    Contact
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-inter font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">Studio Photography</li>
              <li className="text-gray-300">Lifestyle Styling</li>
              <li className="text-gray-300">Commercial Editing</li>
              <li className="text-gray-300">Brand Consulting</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-300">&copy; 2025 VisionCraft Labs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

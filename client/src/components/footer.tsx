// client/src/components/footer.tsx
import React from "react";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand / About */}
          <div>
            <h3 className="text-xl font-semibold mb-3">VisionCraft Labs</h3>
            <p className="text-sm text-gray-400">
              High-end product visuals and image engineering for brands that care about detail.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent-cyan" />
                <a href="mailto:visioncraftlabs@gmail.com" className="hover:text-white">
                  visioncraftlabs@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent-cyan" />
                <a href="tel:+16478324443" className="hover:text-white">
                  +1-647-832-4443
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-accent-cyan" />
                <span>Toronto, Canada</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/visioncraft_labs/?next=%2F"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-accent-cyan transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>

              <a
                href="https://www.facebook.com/people/Visioncraft-Labs/61577453503470/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-accent-cyan transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>

              <a
                href="https://x.com/VisioncraftLabs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="hover:text-accent-cyan transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} VisionCraft Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

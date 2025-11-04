import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer = () => {
  const companyLinks = [
    { label: "About Us", href: "/about-us" },
    { label: "Contact Us", href: "/contact-us" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
  ];
  const propertyLinks = [
    { label: "Buy Property", href: "/buy" },
    { label: "Rent Property", href: "/rent" },
    { label: "New Projects", href: "/new-projects" },
    { label: "Commercial", href: "/commercial" },
  ];
  const servicesLinks = [
    { label: "Home Loans", href: "/services/home-loans" },
    { label: "Legal Services", href: "/services/legal-services" },
    { label: "Interior Design", href: "/services/interior-design" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-16">
        {/* Top Section with Links and Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <img
                src="/investor-logo.png"
                alt="Investorsdeaal Logo"
                className="h-16 w-auto"
              />
              <span className="text-2xl font-bold text-white">
                Investorsdeaal
              </span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-sm">
              India's leading real estate platform to find your perfect property
              with ease and confidence.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:info@investorsdeaal.com">
                  info@investorsdeaal.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors">
                <Phone className="h-5 w-5 text-primary" />
                <a href="tel:+919876543210">+91 98765 43210</a>
              </div>
              <div className="flex items-center space-x-3 text-slate-400">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Explore</h4>
            <ul className="space-y-3">
              {propertyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Services</h4>
            <ul className="space-y-3">
              {servicesLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500 text-center md:text-left">
            © {new Date().getFullYear()} Investorsdeaal. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-4">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                to={social.href}
                className="bg-slate-700 text-slate-300 hover:bg-primary hover:text-white p-2 rounded-full transition-colors"
                aria-label={social.icon.displayName}
              >
                <social.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

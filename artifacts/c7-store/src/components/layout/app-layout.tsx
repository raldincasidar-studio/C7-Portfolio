import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Logo } from "../logo";
import { useCart } from "../../context/cart-context";
import { ShoppingCart, Menu, X, Facebook, Instagram } from "lucide-react";
import { Button } from "../ui/button";
import { CartSidebar } from "../cart/cart-sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/locations", label: "Locations" },
    { href: "/products", label: "Products" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header
        className={`sticky top-0 z-50 w-full border-b transition-shadow duration-200 ${
          isScrolled
            ? "bg-background shadow-md"
            : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        }`}
      >
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Logo size={44} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background shadow-lg">
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-6 py-4 text-base font-semibold border-b border-zinc-100 transition-colors ${
                    location === link.href
                      ? "text-primary bg-primary/5"
                      : "text-foreground hover:bg-zinc-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-zinc-900 text-zinc-300 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Logo size={52} />
            </Link>
            <p className="text-zinc-400 mb-2 max-w-sm leading-relaxed">
              C7 Convenience Store — Your Neighborhood's 24/7 Choice.
            </p>
            <p className="text-zinc-500 text-sm mb-6">Proudly serving Cagayan de Oro City.</p>
            <div className="flex gap-3">
              {/* Facebook — only active social */}
              <a
                href="https://www.facebook.com/c7conveniencestore"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-zinc-800 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="C7 on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              {/* Instagram — placeholder, not available */}
              <span
                className="h-10 w-10 rounded-full bg-zinc-800/50 flex items-center justify-center opacity-40 cursor-not-allowed"
                title="Instagram — coming soon"
              >
                <Instagram className="h-5 w-5" />
              </span>
              {/* TikTok — placeholder */}
              <span
                className="h-10 w-10 rounded-full bg-zinc-800/50 flex items-center justify-center opacity-40 cursor-not-allowed text-zinc-400"
                title="TikTok — coming soon"
                style={{ fontSize: "16px", fontWeight: "bold" }}
              >
                T
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-heading font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-primary transition-colors">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-heading font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <a href="tel:+6388881681" className="hover:text-primary transition-colors">
                  +63 88 881 1681
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/c7conveniencestore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  @c7conveniencestore
                </a>
              </li>
              <li className="leading-snug">
                Tomas Saco Corner 8th Street
                <br />
                Cagayan de Oro, Philippines
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-10 pt-6 border-t border-zinc-800 text-center text-xs text-zinc-600">
          © 2026 C7 Convenience Store. All rights reserved.
        </div>
      </footer>

      <CartSidebar />
    </div>
  );
}

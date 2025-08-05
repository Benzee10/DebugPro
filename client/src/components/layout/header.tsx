import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Camera, Search, Sun, Moon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/use-theme";
import { SearchPanel } from "@/components/gallery/search-panel";

export function Header() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navigation = [
    { name: "Gallery", href: "/", active: location === "/" },
    { name: "Archive", href: "/archive", active: location === "/archive" },
    { name: "Models", href: "/model/mila-azul", active: location.startsWith("/model") },
    { name: "About", href: "/about", active: location === "/about" }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative">
                <svg width="40" height="40" viewBox="0 0 40 40" className="text-primary">
                  {/* Outer circle with gradient */}
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary-hsl))" />
                      <stop offset="100%" stopColor="hsl(calc(var(--accent-hue) + 30), 80%, 65%)" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" opacity="0.2" />
                  <circle cx="20" cy="20" r="15" fill="none" stroke="url(#logoGradient)" strokeWidth="2" filter="url(#glow)" />
                  
                  {/* Stylized camera/lens with sensual curves */}
                  <path d="M12 16 Q20 12 28 16 Q26 20 20 22 Q14 20 12 16 Z" fill="url(#logoGradient)" opacity="0.8" />
                  <circle cx="20" cy="18" r="4" fill="none" stroke="url(#logoGradient)" strokeWidth="1.5" />
                  <circle cx="20" cy="18" r="2" fill="url(#logoGradient)" />
                  
                  {/* Decorative elements */}
                  <circle cx="26" cy="14" r="1.5" fill="url(#logoGradient)" opacity="0.6" />
                  <circle cx="14" cy="14" r="1" fill="url(#logoGradient)" opacity="0.4" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gradient-primary leading-none">
                  Shiny Dollop
                </h1>
                <span className="text-xs text-primary/60 font-medium tracking-wide">
                  Gallery Collection
                </span>
              </div>
            </Link>
            
            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    item.active
                      ? "text-primary"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Search Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
              >
                <Search size={18} />
              </Button>
              
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
              
              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Search Panel */}
        {isSearchOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <SearchPanel onClose={() => setIsSearchOpen(false)} />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden">
          <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl transform transition-transform">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                >
                  <X size={18} />
                </Button>
              </div>
              
              <nav className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block font-medium transition-colors ${
                      item.active
                        ? "text-primary"
                        : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

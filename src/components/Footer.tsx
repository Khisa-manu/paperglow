import React from 'react';
import { ArrowUp, Mail, Phone, MapPin, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-divider bg-surface pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}></span>
              <span className="font-extrabold tracking-tight text-xl uppercase font-['Poppins']">
                Creative<span className="font-light opacity-80">Agency</span>
              </span>
            </div>
            <p className="text-muted text-sm max-w-sm leading-relaxed">
              A full-service design and development studio crafting enduring digital experiences, scalable design systems, and thoughtful brand identities.
            </p>
            <div className="pt-2 flex items-center space-x-4 text-xs text-muted">
              <span>California, USA</span>
              <span>•</span>
              <span>Est. 2014</span>
              <span>•</span>
              <span className="text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Accepting Q4 projects
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 font-['Poppins']">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <button onClick={() => handleNavClick('home')} className="hover:text-primary transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('about')} className="hover:text-primary transition-colors">
                  About Studio
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('work')} className="hover:text-primary transition-colors">
                  Selected Work
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('services')} className="hover:text-primary transition-colors">
                  Capabilities & Pricing
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('blog')} className="hover:text-primary transition-colors">
                  Articles & Insights
                </button>
              </li>
            </ul>
          </div>

          {/* Featured Works */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 font-['Poppins']">
              Featured Case Studies
            </h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <button onClick={() => handleNavClick('work')} className="hover:text-primary transition-colors">
                  Nookdesk Booking App
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('work')} className="hover:text-primary transition-colors">
                  Whisk Design System
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('work')} className="hover:text-primary transition-colors">
                  Harrow &amp; Pine Apothecary
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('work')} className="hover:text-primary transition-colors">
                  Arcade Club Worldwide
                </button>
              </li>
            </ul>
          </div>

          {/* Studio Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 font-['Poppins']">
              Get in Touch
            </h4>
            <div className="space-y-3 text-sm text-muted">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--color-primary)' }} />
                <span>350 Mission St, San Francisco, CA 94105</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 shrink-0" style={{ color: 'var(--color-primary)' }} />
                <a href="mailto:hello@creativeagency.design" className="hover:underline">
                  hello@creativeagency.design
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 shrink-0" style={{ color: 'var(--color-primary)' }} />
                <span>+1 (415) 890-4122</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-divider flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <p>© {new Date().getFullYear()} Creative Agency Studio. Originally based on Colorlib theme.</p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for web excellence
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full border border-divider hover:bg-base text-contrast transition-all hover:-translate-y-0.5"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
